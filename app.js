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

app.get('/createlandmark', async (req, res) => {
  const landmark =
    new Landmark({
      title: "Dakota Waterfall",
      description: "Beautiful location", location: "Minnesota"
    });
  await landmark.save();
  res.send(landmark);
});
