const mongoose = require('mongoose');

const breedShema = new mongoose.Schema({
    breed: {
        type: String,
        required: [true, 'Breed is required!'],
        minLength: [3, 'Breed is too short!'], 
        maxLength: [25, 'Breed is too long!'],
        unique: true
    }
});

const Breed = mongoose.model('Breed', breedShema);

module.exports = Breed;