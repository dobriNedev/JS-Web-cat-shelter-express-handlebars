const Breed = require('../models/Breed');

exports.create = (breed) => Breed.create({ breed });

exports.getAll = () => Breed.find();

exports.getOne = (breed) => Breed.findOne({ breed });