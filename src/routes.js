const express = require('express');
const Router = express.Router;
const router = Router();
//TO DO: import controllers
const homeController = require('./controllers/homeController');

//TO DO: implement endpoints and actions
router.get('/', homeController.getHomePage);


module.exports = router;