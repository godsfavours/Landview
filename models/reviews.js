// Creates and exports Landmarks Schema and Model

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 'mongoose.Schema' will be used often

const ReviewsSchema = new Schema({
  user: String,
  text: String,
  rating: Number,
})

module.exports = mongoose.model('Review', ReviewsSchema);