const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required!'],
        minLength: [2, 'First name is too short']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!'],
        minLength: [2, 'Last name is too short']
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: [3, 'Username is too short']
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        match: [/[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'Invalid email or password!']
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    }, 
    myOfferedCats: [ 
        {type: mongoose.Types.ObjectId,
        ref: 'Cat'}
    ], 
    myShelteredCats: [ 
        {type: mongoose.Types.ObjectId,
        ref: 'Cat'}
    ]    
});

const User = mongoose.model('User', userSchema); 

module.exports = User;