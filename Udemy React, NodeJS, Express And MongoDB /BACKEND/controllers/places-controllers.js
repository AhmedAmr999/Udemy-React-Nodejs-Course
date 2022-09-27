const HttpError = require("../models/http-error");
//const { v4: uuidv4 } = require('uuid')
const { validationResult } = require("express-validator");
const getCoordsForAdd = require("../Util/loaction");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const user = require("../models/user");




const getPlaceById = async (req, res, next) => {
  //console.log("GET Request in Places")
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place!", 500)
    );
  }

  if (!place) {
    // const error=new Error('Could Not Find place for the provided place id!')
    // error.code=404
    // throw error
    return next(
      new HttpError("Could Not Find place for the provided place id!", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) }); //=> toObject({getters:true}) remove underscore from id
};

const getPlacesbyuserId = async (req, res, next) => {
  const userId = req.params.uid;
  //let places
  //replace places with userWithplaces and replace User.findById(userId).populate('places'); with places.find({creator:userId})

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a userId!", 500)
    );
  }
  if (!userWithPlaces || userWithPlaces.length === 0) {
    // const error=new Error('Could not find user for the provided user id!')
    // error.code=404
    // return next(error)
    return next(
      new HttpError("Could not find Places for the provided user id!", 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid Inputs passed check your data", 422));
  }

  const { title, description, address, creator } = req.body;
  //instead of const title=req.body.title|
  let coordinates;
  try {
    coordinates = getCoordsForAdd(address);
  } catch (error) {
    return next(error);
  }
  // const createdPlace={
  //     id:uuidv4(),
  //     title, //talama nafs el esm di shortcut instead of title:title
  //     description,
  //     location:coordinates,
  //     address,
  //     creator
  // }
  //DUMMY_PLACES.push(createdPlace)

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Failed To Create Place", 500));
  }

  if (!user) {
    return next(new HttpError("Can not find User With Provided Id", 404));
  }
  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);

    await user.save({ session: sess });
    await sess.commitTransaction();
    
  } catch (error) {
    return next(new HttpError(error, 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid Inputs passed check your data", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    next(new HttpError("Something went wrong updating places", 500));
  }

  place.title = title;
  place.description = description;

  try {
    place.save();
  } catch (error) {
    next(new HttpError("Something went wrong updating places", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    next(new HttpError("Something went wrong deleting place", 500));
  }

  if (!place) {
    next(new HttpError("Could not find place with provided id!!!! ", 404));
  }

  try {
    const sess=await mongoose.startSession();
    sess.startTransaction();

    await place.remove({session:sess});
    place.creator.places.pull(place);

    await place.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    next(new HttpError("Something went wrong deleting place", 500));
  }


  res.status(200).json({ message: "Delete Place Successfully!!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesbyuserId = getPlacesbyuserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
