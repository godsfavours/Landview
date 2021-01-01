const { landmarkSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Landmark = require('./models/landmarks');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateLandmark = (req, res, next) => {
  const { error } = landmarkSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const landmark = await Landmark.findById(id);
  if (!landmark.author.equals(req.user._id)) {
    req.flash('error', `You don't have permission to do that`);
    return res.redirect(`/landmarks/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}