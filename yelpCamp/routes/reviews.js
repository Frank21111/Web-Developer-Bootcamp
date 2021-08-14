const express = require("express");
const router  = express.Router({mergeParams : true});
const wrapAsync = require("../utilities/catchAsync");
const {isLoggedIn, isRevOwner, validateReview} = require("../utilities/middleware.js");
const revController = require("../controllers/reviews.js");

router.route("/").post(isLoggedIn, validateReview ,wrapAsync(revController.newReview))

router.route("/:rev_id").delete(isLoggedIn, isRevOwner, wrapAsync(revController.delete))

module.exports = router;