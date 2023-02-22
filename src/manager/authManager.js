const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwtUtil');
const config = require('../config/config');
//!!async function!!
exports.getUserByUsername = (username) => User.findOne({ username });

exports.getUserByEmail = (email) => User.findOne({email});
//$addToSet: -> pushes the catId in the array only if it doesn't exist in the array
exports.addToMyOfferedCats = (userId, catId) => User.findByIdAndUpdate(userId, {$addToSet: {myOfferedCats: catId}});
//$addToSet: -> pushes the catId in the array only if it doesn't exist in the array
exports.addToMyShelteredCats = (userId, catId) => User.findByIdAndUpdate(userId, {$addToSet: {myShelteredCats: catId}});

exports.register = async(firstName, lastName, username, email, password, repeatPassword) => {
    
    if (password !== repeatPassword) {
        throw new Error('Password Missmatch!')
    }

    if (password < 3) {
        throw new Error('Password too short!');
    }

    let existingUser = await this.getUserByUsername(username);

    if (existingUser) {
        throw new Error('Username already in use!');
    }

    existingUser = await this.getUserByEmail(email);

    if (existingUser) {
        throw new Error('Email already in use!');
    }

    const hash =  await bcrypt.hash(password, 10);
    
    return await User.create({ firstName, lastName, username, email, password: hash });
};

exports.login = async(username, password) => {
    const user = await this.getUserByUsername(username);

    if (!user) {
        throw new Error('Invalid user!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid password!');
    }

    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.firstName + ' ' + user.lastName, 
        username
    }

    const token = jwt.sign(payload, config.SECRET);

    return token;
};

exports.logout = (req, res) => {
    res.clearCookie(config.COOKIE_TOKEN_NAME);
    res.redirect('/');
};