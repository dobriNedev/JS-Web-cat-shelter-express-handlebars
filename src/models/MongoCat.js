const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required!']
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [5, 'Description too short!'],
        maxLength: [200, 'Description too long!']
    },
    breed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Breed',
        required: [true, 'Breed is required!']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner is required!']
    },
    sheltered: {
        type: Boolean,
        default: false,
        enum: ['true, false']
    },
    commentsList: [
        {userID: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        comments:[{
            type: String,
            minLength: [2, 'Comment is too short!'],
            minLength: [40, 'Comment is too long!'],
        }]}
    ]
});

const MongoCat = mongoose.model('Cat', catSchema);

module.exports = MongoCat;