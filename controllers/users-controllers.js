const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const DUMMY_USERS = [
  {
    id: "u1",
    name: "Bryan Guner",
    email: "bryan.guner@gmail.com",
    password: "testers",
  },
];
//------------------Get Users------------------
const getUsers = async ( req, res, next ) => {
    
    let users;
    try {
  //Alternative to  Users.find( {} , '-password' ); is Users.find( {} , 'name email' );
        users = await User.find( {}, "-password" );
    } catch ( err ) {
        const error = new HttpError(
            "Fetching users failed, please try again later.",
            500
        );
        return next( error );
    }
    res.json( { users: users.map( user => user.toObject( { getters: true } ) ) } );
};

//------------------Signup------------------
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    //findOne asynchronusly finds a document using the criteria provided as an argument
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, findOne method did not work.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://avatars.githubusercontent.com/u/66654881?v=4",
    password,
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try again.", 500);
    return next(error);
  }
  //{ getters: true} removes the underscore from the id
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Login failed, findOne method did not work.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
