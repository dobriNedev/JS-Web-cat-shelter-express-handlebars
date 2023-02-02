const express = require('express');
const Router = express.Router;
const router = Router();
const upload = require('./upload');
//TO DO: import controllers
const homeController = require('./controllers/homeController');
const breedController = require('./controllers/breedController');
const catController = require('./controllers/catController');
//TO DO: implement endpoints and actions
//Home and search
router.get('/', homeController.getHomePage);
router.get('/search', homeController.getSearch);
//Cats
router.get('/cats/addCat', catController.getAddCat);
router.post('/cats/addCat', upload.single('upload'), catController.postAddCat);
router.get('/cats/:id/edit', catController.getEdit);
//Breeds
router.get('/cats/addBreed', breedController.getBreedAdd);
router.post('/cats/addBreed', breedController.postBreedAdd);


module.exports = router;