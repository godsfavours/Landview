const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Landmark = require('./models/landmarks');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/land-view', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection; // mongoose.connection used often
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to database");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.listen(8080, () => {
  console.log("Listening on port 8080 (localhost:8080)");
})

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/landmarks/create', (req, res) => {
  res.render('landmarks/create_landmark');
});

app.post('/landmarks', async (req, res) => {
  const landmark = new Landmark(req.body.landmark);
  await landmark.save();
  res.redirect(`landmarks/${landmark._id}`);
});

app.get('/landmarks', async (req, res) => {
  const landmarks = await Landmark.find({});
  res.render('landmarks/all_landmarks', { landmarks })
});

app.get('/landmarks/:id', async (req, res) => {
  const landmark = await Landmark.findById(req.params.id);
  res.render('landmarks/display_landmark', { landmark })
});

app.get('/landmarks/:id/edit', async (req, res) => {
  const landmark = await Landmark.findById(req.params.id);
  res.render('landmarks/edit_landmark', { landmark })
});

app.put('/landmarks/:id', async (req, res) => {
  await Landmark.findByIdAndUpdate(req.params.id, { ...req.body.landmark });
  res.redirect(`/landmarks/${req.params.id}`);
})