const User = require('../models/User');
const bcrypt = require('bcrypt');
//!!async function!!
exports.getUserByUsername = (username) => User.findOne({username});

exports.register = async(username, password) => {
    const hashPass = await bcrypt.hash(password, 10);
    return await User.create({ username, password: hashPass });
};