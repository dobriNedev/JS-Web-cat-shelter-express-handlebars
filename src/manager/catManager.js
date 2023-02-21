const Cat = require('../models/MongoCat');
const User = require('../models/User');
const Breed = require('../models/Breed');
const fs = require('fs');
const path = require('path');

exports.getOneById = (catId) => Cat.findById(catId);
 
exports.add = (name, imgUrl, description, breedId, userId) => Cat.create({name, imageUrl: imgUrl, description, breed:breedId, owner: userId})
