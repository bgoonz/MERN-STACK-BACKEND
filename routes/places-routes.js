const express = require("express");
const getPlaceById = require("../controllers/places-controller").getPlaceById;
const getPlacesByUserId =
  require("../controllers/places-controller").getPlacesByUserId;
const createPlace = require("../controllers/places-controller").createPlace;
const updatePlaceById =
  require("../controllers/places-controller").updatePlaceById;
const deletePlaceById =
    require( "../controllers/places-controller" ).deletePlaceById;
  
    
const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post("/", createPlace);

router.patch("/:pid", updatePlaceById);

router.delete("/:pid", deletePlaceById);
module.exports = router;
