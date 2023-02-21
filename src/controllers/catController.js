const MongoCat = require('../models/MongoCat');
const Breed = require('../models/Breed');
const fs = require('fs');
const path = require('path');

const breedManager = require('../manager/breedManager');
const authManager = require('../manager/authManager');
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

exports.getEdit = async (req, res) => {
    try {
        const cat = await MongoCat.findById(req.params.id).populate('breed').lean();
        //TO DO: find a way to show the breeed of the cat as selected in options
        //1.find the breed of the cat
        const selected = cat.breed.breed;
        //2.find all breeds except the selected one
        const breeds = await Breed.find({ _id: { $ne: cat.breed._id } }).lean();
        res.render('edit', { cat, breeds, selected });
    } catch (error) {
        res.status(404).render('edit', { error: getError(error) });
    }
};

exports.postEdit = async (req, res) => {
    const catId = req.params.id;
    const { name, breed, description } = req.body;

    let imageUrl;
    //Check if a new image was uploaded
    if (req.file) {
        imageUrl = `/images/cats/${req.file.originalname}`;
    }

    try {
        const breedDB = await breedManager.getOne(breed);

        const breedId = breedDB._id;

        await catManager.edit(catId, name, breedId, description, imageUrl)

        res.redirect('/');

    } catch (error) {
        res.status(404).render('edit', { error: getError(error) });
    }
};

exports.getShelterCat = async (req, res) => {
    const catId = req.params.id;
    try {
        const cat = await catManager.getOneById(catId).populate('breed').lean();
        res.render('shelterCat', { cat });
    } catch (error) {
        res.status(404).render('shelterCat', { error: getError(error) });
    }
};

exports.postShelterCat = async (req, res) => {
    const catId = req.params.id;
    const userId = res.locals.user._id;
    try {
        await catManager.shelterCat(catId);

        await authManager.addToMyShelteredCats(userId, catId);
        // //This functionality is supposed to delete the image of the cat if only one cat has that image
        // //TO DO: NEEDS BUG FIX 
        // //checking if more than one cat has the same image
        // const catsWithSameImg = await catManager.getAllByImageUrl(cat.imageUrl);
        // console.log(catsWithSameImg)
        // //if only one cat has that image delete the image
        // if (catsWithSameImg.length === 1) {
        //     const filePath = path.join(__dirname, 'public', cat.imageUrl);
        //     console.log(fs.existsSync(filePath))
        //     if (fs.existsSync(filePath)) {
        //         await fs.promises.unlink(filePath);
        //     } else {
        //         throw new Error(`File ${filePath} not found!`);
        //     }
        // }

        res.redirect('/');
    } catch (error) {
        res.status(404).render('shelterCat', { error: getError(error) });
    }
};