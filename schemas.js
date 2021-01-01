// Schemas used for back-end validation of schemas

const Joi = require('joi');

module.exports.landmarkSchema = Joi.object({
  landmark: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    user: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
    text: Joi.string().required(),
  }).required()
});