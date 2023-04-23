const express = require("express");
const { check } = require("express-validator");
const getPlaceById = require("../controllers/places-controller").getPlaceById;
const getPlacesByUserId =
  require("../controllers/places-controller").getPlacesByUserId;
const createPlace = require("../controllers/places-controller").createPlace;
const updatePlace = require("../controllers/places-controller").updatePlace;
const deletePlaceById =
  require("../controllers/places-controller").deletePlaceById;
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

//-------Routes--------------------------------
const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);
//every route before this one is open to everyone... after this one is protected by authentication
router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],

  updatePlace
);

router.delete("/:pid", deletePlaceById);

module.exports = router;
