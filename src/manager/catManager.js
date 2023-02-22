const Cat = require('../models/MongoCat');
const User = require('../models/User');
const Breed = require('../models/Breed');
const fs = require('fs');
const path = require('path');

exports.getOneById = (catId) => Cat.findById(catId);

exports.getAllByImageUrl = (imageUrl) => Cat.find({ imageUrl });

exports.getAllNotShelterd = () => Cat.find({ sheltered: false });
 
exports.add = (name, imgUrl, description, breedId, userId) => Cat.create({name, imageUrl: imgUrl, description, breed:breedId, owner: userId})

exports.edit = (catId, name, breed, description, imageUrl) => Cat.findByIdAndUpdate(catId, { name, breed, description, imageUrl });

exports.shelterCat = (catId) => Cat.findByIdAndUpdate(catId, { sheltered: true });

//finds all cats maching the regex, options -> i stands for case-insensitive
exports.search = (query) => Cat.find({name: {$regex: new RegExp(query), $options: 'i'}, sheltered: false});

exports.checkIfUserIsOwner = async(catId, userId) => {
    const cat = await this.getOneById(catId).populate('owner');
    const ownerId = cat.owner._id;
    return ownerId == userId;
};