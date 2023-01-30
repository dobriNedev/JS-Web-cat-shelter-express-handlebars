const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type:String,
        required: true,
        match: [/^https?:\/\//g, 'Invalid URL!']
    },
    breed: {
        type: String,
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