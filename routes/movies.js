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

// Route for displaying a single movie's details
router.get('/:id', async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id); // Find the movie by ID
      if (movie) {
        res.render('movieDetails', { title: movie.title, movie });
      } else {
        res.redirect('/movies'); // Redirect to the movies list if the movie is not found
      }
    } catch (error) {
      next(error);
    }
  });  
  
module.exports = router;
