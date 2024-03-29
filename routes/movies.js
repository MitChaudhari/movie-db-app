var express = require('express');
var router = express.Router();
const Movie = require('../models/movie');

// Route for displaying all movies
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find({}, 'title director year').sort({ title: 1 }); // Fetch movies and sort by title
    res.render('movies', { title: 'Movies List', movies });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
