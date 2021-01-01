const express = require('express');
const router = express.Router({ mergeParams: true });

// models and schemas
const Landmark = require('../models/landmarks');
const Review = require('../models/reviews');
const { reviewSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

// utilities
const catchAsync = require('../utils/catchAsync');

// middleware
const { validateReview } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const landmark = await Landmark.findById(req.params.id);
  const review = new Review(req.body.review);
  landmark.reviews.push(review);
  await review.save();
  await landmark.save();
  req.flash('success', 'Successfully posted review!');
  res.redirect(`/landmarks/${landmark._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Landmark.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/landmarks/${id}`);
}))

module.exports = router;