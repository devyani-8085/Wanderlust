const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object().required({
       title: Joi.string().required(),
       description: Joi.string().required(),
       price: Joi.number().required().min(0),
       location: Joi.string().required(),
       country: Joi.string().required(),
       category: Joi.string().valid("Beach", "Mountains", "City", "Countryside", "Desert", "Forest", "Island", "Other").required(),
       image: Joi.string().allow('', null).optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object().required({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});