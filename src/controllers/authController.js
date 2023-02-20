const authManager = require('../manager/authManager');
const test = require('../testRequest');
const { getError} = require('../utils/errorUtil');
const config = require('../config/config');

exports.getLogin = async(req, res) => {
    res.render('login');
};

exports.postLogin = async(req, res) => {
    const { username, password} = req.body;
    
    try {
        const token = await authManager.login(username, password);
        res.cookie(config.COOKIE_TOKEN_NAME, token);
        res.redirect('/');
    } catch (error) {
        res.status(401).render('login', { error: getError(error) } );
    }
};

exports.getRegister = async(req, res) => {
    res.render('register');
};

exports.postRegister = async(req, res) => {
    const { firstName, lastName, username, email , password, repeatPassword } = req.body;

    try {
        await authManager.register(firstName, lastName, username, email , password, repeatPassword);
        res.redirect('/auth/login');
    } catch (error) {
        res.status(400).render('register', { error: getError(error) } );
    }
};