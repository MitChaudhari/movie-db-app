var express = require('express');
var router = express.Router();
const Movie = require('../models/movie');
const { body, validationResult } = require('express-validator');

// Route for displaying all movies
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find({}, 'title director year').sort({ title: 1 }); // Fetch movies and sort by title
    res.render('movies', { title: 'Movies List', movies });
  } catch (error) {
    next(error);
  }
});

// Display the form for creating a new movie
router.get('/new', (req, res) => {
    res.render('movieForm', { title: 'Create New Movie' });
});

// Handle the submission of the creation form
router.post('/',
  // Validation and sanitization
  [
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required.').escape(),
    body('director').trim().isLength({ min: 1 }).withMessage('Director is required.').escape(),
    body('year').trim().isLength({ min: 4, max: 4 }).withMessage('A valid year is required.').isNumeric().escape(),
    body('notes').optional({ checkFalsy: true }).trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('movieForm', { title: 'Create New Movie', movie: req.body, errors: errors.array() });
      return;
    }
    const movie = new Movie({ ...req.body });
    await movie.save();
    res.redirect('/movies');
  }
);

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

// Display the form for editing an existing movie
router.get('/:id/edit', async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (movie) {
        res.render('movieForm', { title: 'Edit Movie', movie });
      } else {
        res.redirect('/movies');
      }
    } catch (error) {
      next(error);
    }
});

// Handle the submission of the edit form
router.post('/:id/edit',
  // Validation and sanitization
  [
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required.').escape(),
    body('director').trim().isLength({ min: 1 }).withMessage('Director is required.').escape(),
    body('year').trim().isLength({ min: 4, max: 4 }).withMessage('A valid year is required.').isNumeric().escape(),
    body('notes').optional({ checkFalsy: true }).trim().escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('movieForm', { title: 'Edit Movie', movie: req.body, errors: errors.array(), editing: true, movieId: req.params.id });
      return;
    }
    await Movie.findByIdAndUpdate(req.params.id, { ...req.body });
    res.redirect('/movies/' + req.params.id);
  }
);

// Handle the POST request for deleting a movie
router.post('/:id/delete', async (req, res, next) => {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.redirect('/movies');
    } catch (error) {
      next(error);
    }
  });
module.exports = router;
