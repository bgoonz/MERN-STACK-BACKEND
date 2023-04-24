const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const fs = require("fs");

//------------------Get Place By Id------------------
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  //{pid:'p1'}
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    //if we have an error with the get request
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  //if we don't have a place with the id
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

//------------------Get Places By User Id------------------
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    // we have to add the user id to find otherwise we will get all paces.
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a places for the provided user-id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

//------------------Create Place------------------
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }
  console.log(user);
  try {
    const curSession = await mongoose.startSession();
    curSession.startTransaction();
    await createdPlace.save({ session: curSession });
    user.places.push(createdPlace);
    //save updated user
    await user.save({ session: curSession });
    await curSession.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, either data base server is down or database validation failed.",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

//------------------Update Place------------------
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }
    //place.creator is an object of type mongoose.Types.ObjectId
    if ( place.creator.toString() !== req.userData.userId ) {
        const error = new HttpError(
            "You are not allowed to edit this place.",
            401
        );
        return next( error );
    }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update (save) place.",
      500
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

//------------------Delete Place------------------
const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    //populate allows us to refer to a document stored in another collection
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

    if ( place.creator.id !== req.userData.userId ) {
        const error = new HttpError(
            "You are not allowed to delete this place.",
            401
        );
        return next( error );
    }
    
 
    
  const imagePath = place.image;

  try {
    // await place.deleteOne();
    const curSession = await mongoose.startSession();
    curSession.startTransaction();
    await place.deleteOne({ session: curSession });
    place.creator.places.pull(place);
    await place.creator.save({ session: curSession });
    await curSession.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete (remove) place.",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlaceById = deletePlaceById;
