const {getError} = require('../utils/errorUtil');
const breedManager = require('../manager/breedManager');

exports.getBreedAdd = (req, res) => {
    res.render('addBreed');
};

exports.postBreedAdd = async (req, res) => {
    const breed = req.body.breed;
    
    try {
        await breedManager.create(breed);
        res.redirect('/');
    } catch (error) {
        res.status(404).render('addBreed', {error: getError(error)});
    }
}