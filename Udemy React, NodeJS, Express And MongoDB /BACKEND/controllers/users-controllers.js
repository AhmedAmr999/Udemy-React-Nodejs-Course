const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const { json } = require("body-parser");



const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs passed check your data", 422));
  }

  const { name, email, password } = req.body;
  // const hasUser=DUMMY_USERS.find(u=>u.email===email)
  // if(hasUser){
  //     throw new HttpError("Email already Used please enter new email",401)
  // }
  // const addUser={
  //     id:uuidv4(),
  //     name,
  //     email,
  //     password
  // }
  // DUMMY_USERS.push(addUser)

  //email validation that will appear to the user

  let existingEmail;

  try {
    existingEmail = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Signup error!!!", 500));
  }
  if (existingEmail) {
    return next(new HttpError("User Already Found Error!!!", 500));
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    places:[],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Create user error!!!", 422));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  //   const checkUser = DUMMY_USERS.find((u) => {
  //     if (u.email === email && u.password === password) {
  //       res.status(200).json({ message: "User found" });
  //     } else {
  //       throw new HttpError("Coundnot find user", 401);
  //     }
  //   });
  let checkUser;
  try {
    checkUser = await User.findOne({ email: email, password: password });
  } catch (error) {
    return next(new HttpError("LOGIN ERROR!!!!", 500));
  }

  if (!checkUser) {
    return next(new HttpError("User Not Found ", 422));
  }
  res.status(200).json({ message: "User found" });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //return all except the password
  } catch (error) {
    return next(new HttpError("GET USERS ERROR!!!!", 500));
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

exports.signUp = signUp;
exports.login = login;
exports.getUsers = getUsers;
