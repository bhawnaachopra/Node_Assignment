let mongoose = require('mongoose');

// Band Schema
let bandScheme = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  }
});

let Band = module.exports = mongoose.model('Band', bandScheme);
