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
  for (i = 0; i < 10; i++) {
    // *** need to add user id
    const random = Math.floor(Math.random() * 1000);
    const city = cities[random];
    const landmark = new Landmark({
      author: '5fef8dd1749d56284c518c98',
      location: `${city.city}, ${city.state}`,
      name: `${randomElem(descriptors)} ${randomElem(places)}`,
      image: 'https://images.unsplash.com/photo-1499720565725-bd574541a3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxyYW5kb218fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080',
      description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis sint id velit accusamus perspiciatis ab amet ut quia nesciunt. Porro placeat quos ab reiciendis corporis facilis! Maiores dolorum reprehenderit eveniet.
      Nesciunt doloribus laborum adipisci fuga distinctio accusamus velit similique quibusdam accusantium quae labore quasi sed minima cupiditate pariatur, sequi ducimus nostrum, obcaecati ad? Eligendi quis officiis explicabo aliquam corrupti odio?
      Sint tempora velit soluta aut suscipit laudantium quo minus itaque, doloribus quis veniam voluptate aspernatur iusto facilis? Atque voluptatem officiis rem, et odio molestias ea eligendi iure, officia deleniti cupiditate.
      Corporis, illum quas, necessitatibus eum modi similique sunt doloribus deserunt architecto sit, delectus itaque facilis? Modi inventore facilis fuga in, adipisci consectetur fugiat suscipit temporibus eius itaque asperiores error obcaecati.`,
      lastUpdated: Date.now(),
      reviews: []
    });
    await landmark.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});