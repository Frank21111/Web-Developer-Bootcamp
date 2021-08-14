const CampGround = require("../models/campground.js");
const Review = require("../models/review.js");


module.exports.newReview = async (req,res,next)=>{
    const {id} = req.params;
    const {body} = req.body.review;
    const rating = req.body.rating;
    const newReview = new Review({body, rating , owner:req.user});
    const campground = await CampGround.findById(id);
    campground.reviews.push(newReview);
    req.flash("success", "Created new Review!")
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async(req,res)=>{
    const {id, rev_id} = req.params;
    console.log(id, rev_id, req.params);
    await Review.findByIdAndDelete(rev_id).then((review)=>console.log(review));
    await CampGround.findByIdAndUpdate(id, {$pull : { reviews : rev_id}})
    req.flash("success", "Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)
}