const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
    title: String,
    price: Number,
    image:[{
        url: String,
        filename: String 
    }],
    description: String,
    location: String,
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref : "Review"}],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

campGroundSchema.post("findOneAndDelete", async(deletedCamp)=>{
    if(deletedCamp){
     if(deletedCamp.reviews.length !== 0){
            await Review.deleteMany({ _id : { $in : deletedCamp.reviews}})
        }
    }
})

module.exports = mongoose.model("CampGround", campGroundSchema); 