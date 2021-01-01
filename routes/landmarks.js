const express = require('express');
const router = express.Router();

const Landmark = require('../models/landmarks');
const { landmarkSchema } = require('../schemas.js');

const { isLoggedIn, validateLandmark, isAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');

router.get('/create', isLoggedIn, (req, res) => {
  res.render('landmarks/create_landmark');
});

router.post('/', isLoggedIn, validateLandmark, catchAsync(async (req, res, next) => {
  const landmark = new Landmark(req.body.landmark);
  landmark.author = req.user._id;
  await landmark.save();
  req.flash('success', 'Successfully created landmark!');
  res.redirect(`/landmarks/${landmark._id}`);
}));

router.get('/', catchAsync(async (req, res, next) => {
  const landmarks = await Landmark.find({});
  res.render('landmarks/all_landmarks', { landmarks })
}));

router.get('/:id', catchAsync(async (req, res, next) => {
  const landmark = await (await Landmark.findById(req.params.id).populate('reviews').populate('author'));
  res.render('landmarks/display_landmark', { landmark })
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
  const landmark = await Landmark.findById(req.params.id);
  if (!landmark) {
    req.flash('error', 'Cannot find that landmark!');
    return res.redirect('/landmarks');
  }
  res.render('landmarks/edit_landmark', { landmark })
}));

router.put('/:id', isLoggedIn, isAuthor, validateLandmark, catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Landmark.findByIdAndUpdate(id, { ...req.body.landmark, lastUpdated: Date.now() });
  req.flash('success', 'Successfully updated landmark!');
  res.redirect(`/landmarks/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  await Landmark.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted landmark!');
  res.redirect('/landmarks');
}));

module.exports = router;