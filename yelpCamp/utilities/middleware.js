 const wrapAsync = require("./catchAsync");
 const CampGround = require("../models/campground.js")
 const Review = require("../models/review.js")
 const ExpressError = require("../utilities/ExpressError");
 const {reviewSchema,campgroundSchema} = require("../SchemaValidations/Schemas.js");


const isLoggedIn = (req,res,next)=>{
   
    if(!req.isAuthenticated()){
        req.session.originalUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/users/login");
    }
    else
        next();
}

const isCampOwner = wrapAsync(async(req,res,next)=>{
    const camp_id = req.params.id;
    const campground = await CampGround.findById(camp_id);
    if(campground && campground.owner._id.equals(req.user._id)){
        next()
    }else{
        req.flash("error", "That campground isn´t yours");
        res.redirect("/campgrounds");
    }

})


const isRevOwner = wrapAsync(async(req,res,next)=>{
    const {rev_id} = req.params;
    const camp_id = req.params.id;
    const review = await Review.findById(rev_id);
    console.log("REview ID:", rev_id)
    console.log(rev_id ,review.owner, req.user._id)
    if(review && review.owner.equals(req.user._id)){
        next()
    }else{
        req.flash("error", "That review isn´t yours");
        res.redirect(`/campgrounds/${camp_id}`);
    }

})



const validateCampground = (req,res,next)=>{
    console.log(req.body);
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(", ");
        throw new ExpressError(msg, 400)}
    else 
        next();
}


const validateReview = (req,res,next)=>{
    const validationRes = reviewSchema.validate(req.body.review);
    if(validationRes.error)
        return next(new ExpressError(validationRes.error.details.map(el=>el.message).join(", "), 400))
    else
        next()
}


module.exports.isLoggedIn = isLoggedIn;
module.exports.isCampOwner = isCampOwner;
module.exports.isRevOwner = isRevOwner;
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;