const Joi = require('joi');
//sever side validation
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),  // Changed from string to number
        image: Joi.string().allow("", null)
    }).required(),
});

module.exports = { listingSchema };


const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().required()
    }).required(),
});

module.exports = { reviewSchema };