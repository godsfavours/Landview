const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Landmark = require('./models/landmarks');

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

app.listen(8080, () => {
  console.log("Listening on port 8080 (localhost:8080)");
})

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/landmarks', async (req, res) => {
  const landmarks = await Landmark.find({});
  res.render('landmarks/all_landmarks', { landmarks })
});

app.get('/landmarks/:id', async (req, res) => {
  const { id } = req.params;
  const landmark = await Landmark.findById(id);
  res.render('landmarks/landmark', { landmark })
});