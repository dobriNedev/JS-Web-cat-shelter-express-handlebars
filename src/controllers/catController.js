const MongoCat = require('../models/MongoCat');
const Breed = require('../models/Breed');

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