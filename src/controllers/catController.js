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
        //TO DO: find a way to show the breeed of the cat as selected in options
        //1.find the breed of the cat
        const selected = cat.breed.breed;
        //2.find all breeds except the selected one
        const breeds = await Breed.find({_id: {$ne: cat.breed._id}}).lean();
        res.render('edit', { cat, breeds, selected });
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