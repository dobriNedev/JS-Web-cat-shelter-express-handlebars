const mongoose = require('mongoose');

const breedShema = new mongoose.Schema({
    breed: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25
    }
});

const Breed = mongoose.model('Breed', breedShema);

module.exports = Breed;