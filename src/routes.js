const express = require('express');
const Router = express.Router;
const router = Router();
const upload = require('./upload');
const { isAuthenticated, isOwner, isNotOwner } = require('./middlewares/authMiddleware');
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
router.get('/auth/logout', isAuthenticated, authController.getLogout);
//Profile
router.get('/auth/profile', isAuthenticated, authController.getProfile);
//Cats
//Add
router.get('/cats/addCat',isAuthenticated, catController.getAddCat);
router.post('/cats/addCat',isAuthenticated, upload.single('upload'), catController.postAddCat);
//Edit
router.get('/cats/:id/edit', isAuthenticated, isOwner, catController.getEdit);
router.post('/cats/:id/edit', isAuthenticated, isOwner , upload.single('image'), catController.postEdit);
//Delete (aka Shelter)
router.get('/cats/:id/shelterCat', isAuthenticated, isNotOwner, catController.getShelterCat);
router.post('/cats/:id/shelterCat', isAuthenticated, isNotOwner, catController.postShelterCat);
//Breeds
router.get('/cats/addBreed',isAuthenticated, breedController.getBreedAdd);
router.post('/cats/addBreed',isAuthenticated, breedController.postBreedAdd);


module.exports = router;