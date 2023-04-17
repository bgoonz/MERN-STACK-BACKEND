const express = require("express");
const getPlaceById = require("../controllers/places-controller").getPlaceById;
const getPlacesByUserId =
    require( "../controllers/places-controller" ).getPlacesByUserId;
const createPlace = require( "../controllers/places-controller" ).createPlace;
const router = express.Router();

router.get("/:pid", getPlaceById);

router.get( "/user/:uid", getPlacesByUserId );

router.post('/',createPlace);

module.exports = router;
