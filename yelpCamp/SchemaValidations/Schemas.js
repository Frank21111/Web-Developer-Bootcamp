const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
        campground : Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required(),
            location: Joi.string().required()
        }).required(),
        deleteimages: Joi.array()
    });

module.exports.reviewSchema = Joi.object({
    body : Joi.string().required().max(280),
    rating : Joi.number().min(1).max(5)
}).required()