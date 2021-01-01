const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 'mongoose.Schema' will be used often
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

// adds several static methods like authenticate() and serialize()
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);