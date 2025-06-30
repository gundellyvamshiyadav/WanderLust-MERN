const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    
    price: Joi.number().required().min(0),
    
    category: Joi.string().required().valid(
        "Trending", "Rooms", "Iconic cities", "Mountains", "Castles",
        "Amazing pools", "Camping", "Farms", "Arctic", "Domes",
        "Boats", "Lakes", "Tree city", "Beach", "Wineyards",
        "Deserts", "Islands", "Urban", "Eco-friendly", "Ski", "Historical"
    ),

}).required(); 


module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(), 
}).required(); 