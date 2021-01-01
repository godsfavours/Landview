const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const landmarksRoutes = require('./routes/landmarks');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/land-view', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
const db = mongoose.connection; // mongoose.connection used often
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to database");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'secretpassword',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // expires in a week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
  // memory store for now
}
app.use(session(sessionConfig));
app.use(flash());

// to use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// tell passport how to serialize/deserialize users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set up middleware for flash messages
app.use((req, res, next) => {
  // if there is anything in the flash('success'),
  // it is added to locals of res
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', usersRoutes);
app.use('/landmarks', landmarksRoutes);
app.use('/landmarks/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
  res.render('home');
})
app.all('*', (req, re, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Something went wrong';
  }
  res.status(statusCode).render('error', { err });
})

app.listen(8080, () => {
  console.log("Listening on port 8080 (localhost:8080)");
})