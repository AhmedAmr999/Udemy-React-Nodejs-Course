const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());
app.use("/api/places", placesRoutes);

app.use("/api/users", userRoutes);

app.use((res, req, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  next();
});

app.use((req, res, next) => {
  const error = new HttpError("Coudnot find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

//app.use('/api/user',userRoutes)
mongoose
  .connect(
    "mongodb+srv://ahmed:jpJMjjPiLsjv9ZpE@cluster0.dwlq4k9.mongodb.net/ahmed?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("APP LISTENED SUCCESSFULLY!!!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
