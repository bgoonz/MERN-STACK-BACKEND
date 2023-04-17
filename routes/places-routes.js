const express = require("express");
const getPlaceById = require("../controllers/places-controller").getPlaceById;
const getPlacesByUserId =
  require("../controllers/places-controller").getPlacesByUserId;
const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

module.exports = router;
