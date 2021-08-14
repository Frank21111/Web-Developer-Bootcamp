const ExpressError = require("../utilities/ExpressError");
const CampGround = require("../models/campground.js");
const {cloudinary }= require("../cloudinary")

module.exports.index = async (req, res, next)=>{
    const campgrounds = await CampGround.find({});
    if(!campgrounds)
        return next(new ExpressError(400,"Something went wrong"))
    res.render("campgrounds/index.ejs", {campgrounds})
}

module.exports.newCamp = async (req, res, next)=>{
    const images = req.files.map(f=>{return {url : f.path, filename : f.filename}});
    const campground = new CampGround({
        ...req.body.campground, 
        owner: req.user, 
        image : images
    });
    await campground.save();
    console.log(campground)
    req.flash("success", "Campground succesfully made!!!")
    res.redirect(`campgrounds/${campground._id}`)
}

module.exports.show = async (req,res, next)=>{
    const {id} = req.params;
    
    const campground = await CampGround.findById(id).populate({
        path : "reviews",
        populate: {
            path: "owner"
        }
    }).populate("owner");
    if(!campground){
         req.flash("error","Cannot find that campground");
         res.redirect("/campgrounds")
    }
       
    res.render("campgrounds/show.ejs", {campground});
}

module.exports.edit = async (req,res, next)=>{
    const {id} = req.params;
    const campground = await CampGround.findById(id);
    if(!campground){
        req.flash("error","Cannot find that campground");
        res.redirect("/campgrounds")
   }
    res.render("campgrounds/edit.ejs", {campground});
}

module.exports.update = async (req,res, next)=>{
    const {id} = req.params;
    console.log(req.body)
    const campground = await CampGround.findByIdAndUpdate(id, {
        $set : {...req.body.campground }, 
        $addToSet : {image : req.files.map(f=>{return {url: f.path, filename: f.filename}})}},
        { runValidators : true});
    if(req.body.deleteimages){
        for(let filename of req.body.deleteimages)
            await cloudinary.uploader.destroy(filename),
            await campground.updateOne({$pull : {image : {filename : {$in : req.body.deleteimages}}}});
    }
       
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req,res, next)=>{
    const {id} = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
}