const express = require('express');
const Router = express.Router;
const router = Router();
const upload = require('./upload');
const { isAuthenticated } = require('./middlewares/authMiddleware');
//Controllers
const homeController = require('./controllers/homeController');
const breedController = require('./controllers/breedController');
const catController = require('./controllers/catController');
const authController = require('./controllers/authController');
//Endpoints and actions
//Home and search
router.get('/', homeController.getHomePage);
router.get('/search', homeController.getSearch);
//Auth
//Login
router.get('/auth/login', authController.getLogin);
router.post('/auth/login', authController.postLogin);
//Register
router.get('/auth/register', authController.getRegister);
router.post('/auth/register', authController.postRegister);
//Logout

//Cats
//Add
router.get('/cats/addCat', catController.getAddCat);
router.post('/cats/addCat', upload.single('upload'), catController.postAddCat);
//Edit
router.get('/cats/:id/edit', isAuthenticated, catController.getEdit);
router.post('/cats/:id/edit', isAuthenticated,  upload.single('image'), catController.postEdit);
//Delete (aka Shelter)
router.get('/cats/:id/shelterCat', isAuthenticated, catController.getShelterCat);
router.post('/cats/:id/shelterCat', isAuthenticated, catController.postShelterCat);
//Breeds
router.get('/cats/addBreed', breedController.getBreedAdd);
router.post('/cats/addBreed', breedController.postBreedAdd);

module.exports = router;