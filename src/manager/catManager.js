const Cat = require('../models/MongoCat');
const Breed = require('../models/Breed');
const fs = require('fs');
const path = require('path');
 
exports.add = (name, imageUrl, breedId, description, ownerId) => Cat.create({name, imageUrl, description, breed:breedId, owner: ownerId})
