const mongoose = require('mongoose');
const Breed = require('./Breed');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        //TO DO check if validation required
        //match: [/^https?:\/\//g, 'Invalid URL!']
    },
    breed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Breed',
        required: true
    },
    description: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 200
    }
});

const MongoCat = mongoose.model('Cat', catSchema);

module.exports = MongoCat;