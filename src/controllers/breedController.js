const Breed = require('../models/Breed');


exports.getBreedAdd = (req, res) => {
    res.render('addBreed');
};

exports.postBreedAdd = async (req, res) => {
    const breed = req.body.breed;
    console.log(breed)
    try {
        await Breed.create({ breed });
    } catch (error) {
        console.log(error);
    }

    res.redirect('/');
}