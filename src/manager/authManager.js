const User = require('../models/User');
const bcrypt = require('bcrypt');
//!!async function!!
exports.getUserByUsername = (username) => User.findOne({ username });

exports.register = async(firstName, lastName, username, email, password) => {
    const hash =  await bcrypt.hash(password, 10);
    console.log(hash)
    return await User.create({ firstName, lastName, username, email, password: hash });
};

exports.login = async(username, password) => {
    //console.log(this)
    const user = await this.getUserByUsername(username);
    if (!user) {
        return new Error('Invalid user!');
    }
    return await bcrypt.compare(password, user.password);
};