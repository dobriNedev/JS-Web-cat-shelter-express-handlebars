const authManager = require('../manager/authManager');
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

exports.getLogout = (req, res) => authManager.logout(req, res);

exports.getProfile = async(req, res) => {
    const username = res.locals.user?.username;
    const isUser = Boolean(username);
    
    if (!isUser) {
        throw new Error('Functionality ONLY for logged in users!');
    }
    try {

        const user = await authManager.getUserByUsername(username).populate('myOfferedCats').populate('myShelteredCats').lean();
    
        const isOfferedCats = Boolean(user.myOfferedCats?.length);
        
        const isShelteredCats = Boolean(user.myShelteredCats?.length);
        
        let isCats = false;
        if (isOfferedCats || isShelteredCats) {
            isCats = true;
        }
        
        const offeredCats = user.myOfferedCats;
    
        const shelteredCats = user.myShelteredCats;
       
        const offeredCount = user.myOfferedCats.length;
        
        const shelteredCount = user.myShelteredCats.length;

        res.render('profile', { user, offeredCount, shelteredCount , isCats, isOfferedCats, offeredCats, isShelteredCats, shelteredCats });
    } catch (error) {
        res.status(400).render('index', { error: getError(error) } );
    }
};