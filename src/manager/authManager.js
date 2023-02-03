const User = require('../models/User');
const bcrypt = require('bcrypt');
//!!async function!!
exports.getUserByUsername = (username) => User.findOne({ username });

exports.register = async(firstName, lastName, username, email, password) => {
    const hash =  await bcrypt.hash(password, 10);
    console.log(hash)
    return await User.create({ firstName, lastName, username, email, password: hash });
};