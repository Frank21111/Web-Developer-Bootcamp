const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utilities/catchAsync");
const {isLoggedIn, isCampOwner, validateCampground,} = require("../utilities/middleware.js");
const campController = require("../controllers/campgrounds.js")

const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(campController.index))
.post( isLoggedIn, upload.array("campground[image]"), validateCampground, wrapAsync(campController.newCamp) )


router.route("/new").get(isLoggedIn , (req,res)=>{res.render("campgrounds/new.ejs");})

router.route("/:id")
.get(wrapAsync(campController.show))
.put(isLoggedIn, isCampOwner, upload.array("campground[image]"),validateCampground,  wrapAsync(campController.update))
.delete(isLoggedIn, isCampOwner, wrapAsync(campController.delete))

router.route("/:id/edit").get(isLoggedIn, isCampOwner, wrapAsync(campController.edit))

module.exports = router;