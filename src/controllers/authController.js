const User = require('../models/User');

exports.getLogin = async(req, res) => {
    res.render('login');
};

exports.getRegister = async(req, res) => {
    res.render('register');
};