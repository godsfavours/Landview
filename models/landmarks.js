const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 'mongoose.Schema' will be used often

const LandmarksSchema = new Schema({
  title: String,
  description: String,
  location: String,
})

module.exports = mongoose.model('Landmark', LandmarksSchema);