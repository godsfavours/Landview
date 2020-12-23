// Self-contained app for seeding DB with landmarks

const mongoose = require('mongoose');
const Landmark = require('../models/landmarks');
const { places, descriptors } = require('./seedHelpers');
//console.log(places, descriptors);
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/land-view', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const randomElem = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Landmark.deleteMany({});
  for (i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const city = cities[random];
    const landmark = new Landmark({
      location: `${city.city}, ${city.state}`,
      name: `${randomElem(descriptors)} ${randomElem(places)}`
    });
    await landmark.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});