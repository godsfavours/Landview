// Creates and exports Landmarks Schema and Model

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 'mongoose.Schema' will be used often
const Review = require('./reviews.js');

const LandmarksSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  description: String,
  location: String,
  image: String,
  lastUpdated: Date,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

LandmarksSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Landmark', LandmarksSchema);