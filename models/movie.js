// Defines the schema for Movie Collection
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  director: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  notes: { type: String, required: false, trim: true },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
