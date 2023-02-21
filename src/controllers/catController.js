const MongoCat = require('../models/MongoCat');
const Breed = require('../models/Breed');
const fs = require('fs');
const path = require('path');

const breedManager = require('../manager/breedManager');
const authManager  = require('../manager/authManager');
const catManager = require('../manager/catManager');
const { getError } = require('../utils/errorUtil');

exports.getAddCat = async (req, res) => {
    try {
        const breeds = await breedManager.getAll().lean();
        res.render('addCat', { breeds });
    } catch (error) {
        res.status(404).render('addCat', { error: getError(error) });
    }
};

exports.postAddCat = async (req, res) => {
    const breedName = req.body.breed;
    const userId = res.locals.user._id;
    try {
        const breed = await breedManager.getOne(breedName);
        if (!breed) {
            throw new Error('Invalid breed!');
        }
        const breedId = breed._id;
        const { name, description } = req.body;
        const imgUrl = '/images/cats/' + req.file.originalname;
        const cat = await catManager.add(name, imgUrl, description, breedId, userId);
        await authManager.addToMyOfferedCats(userId, cat._id);

        res.redirect('/');
    } catch (error) {
        res.status(404).render('addCat', { error: getError(error) });
    }
};

exports.getEdit =  async (req, res) => {

    try {
        const cat = await MongoCat.findById(req.params.id).populate('breed').lean();
        //TO DO: find a way to show the breeed of the cat as selected in options
        //1.find the breed of the cat
        const selected = cat.breed.breed;
        //2.find all breeds except the selected one
        const breeds = await Breed.find({_id: {$ne: cat.breed._id}}).lean();
        res.render('edit', { cat, breeds, selected });
    } catch (error) {
        res.status(404).render('edit', { error: getError(error) });
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
        res.status(404).render('edit', { error: getError(error) });
    }
};

exports.getShelterCat = async(req, res) => {
    const catId = req.params.id;
    try {
        const cat = await catManager.getOneById(catId).populate('breed').lean();
        res.render('shelterCat', { cat });
    } catch (error) {
        res.status(404).render('shelterCat', { error: getError(error) });
    }
};

exports.postShelterCat = async (req, res) => {
    try {
        const cat  = await MongoCat.findById(req.params.id).populate('breed').lean();
        const catsWithSameImg = await MongoCat.find({imageUrl: cat.imageUrl}).lean();
       if (catsWithSameImg.length === 1) {
            const filePath = path.join(__dirname,'public', cat.imageUrl);
            try {
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                } else {
                    throw new Error(`File ${filePath} not found!`);
                }
            } catch (error) {
                console.error(error);
            }
       } 
    
       try {
            await MongoCat.deleteOne({_id: cat._id});
            res.redirect('/');
       } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Error deleting cat from database' });
       }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error finding cat' });
    }
};