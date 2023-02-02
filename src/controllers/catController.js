const MongoCat = require('../models/MongoCat');
const Breed = require('../models/Breed');
const fs = require('fs');
const path = require('path');

exports.getAddCat = async (req, res) => {
    try {
        const breeds = await Breed.find().lean();
        res.render('addCat', { breeds });
    } catch (error) {
        throw new Error(error);
    }
};

exports.postAddCat = async (req, res) => {
    const breedName = req.body.breed;

    const breed = await Breed.findOne({ breed: breedName });

    if (!breed) {
        return res.status(400).send({ error: 'invalid Breed!' });
    }
    const breedId = breed._id;

    const imgUrl = '/images/cats/' + req.file.originalname;

    const cat = new MongoCat({
        name: req.body.name,
        imageUrl: imgUrl,
        breed: breedId,
        description: req.body.description
    });

    try {
        await cat.save();
        res.redirect('/');
    } catch (error) {
        throw new Error(error);
    }
};

exports.getEdit =  async (req, res) => {
    try {
        const cat = await MongoCat.findById(req.params.id).populate('breed').lean();

        const breeds = await Breed.find().lean();
        //TO DO: find a way to show the breeed of the cat as selected in options
        res.render('edit', { cat, breeds });
    } catch (error) {
        throw new Error(error);
    }
};

exports.postEdit = async (req, res) => {
    const breedName = req.body.breed;
    
    try {
        const breed = await Breed.findOne({breed: breedName});
        
        const breedId = breed._id;

        try {
            const cat = await MongoCat.findById(req.params.id);
            
            const updateData = {
                name: req.body.name,
                breed: breedId,
                description: req.body.description
            }
            //Check if a new image was uploaded
            if (req.file) {
                updateData.imageUrl = `/images/cats/${req.file.originalname}`;
            }
            const updatedCat = await MongoCat.updateOne({_id: cat._id},{$set: updateData})
            
            res.redirect('/');
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
};

exports.getShelterCat = async(req, res) => {
    try {
        const cat = await MongoCat.findById(req.params.id).populate('breed').lean();
        res.render('shelterCat', { cat });
    } catch (error) {
        throw new Error(error)
    }
    
};