const express = require('express');
const Router = express.Router;
const router = Router();
//TO DO: import controllers
const homeController = require('./controllers/homeController');
const breedController = require('./controllers/breedController');

//TO DO: implement endpoints and actions
//Home
router.get('/', homeController.getHomePage);
router.get('/search', homeController.getSearch);
//Cats

//Breeds
router.get('/cats/addBreed', breedController.getBreedAdd);
router.post('/cats/addBreed', breedController.postBreedAdd);


module.exports = router;