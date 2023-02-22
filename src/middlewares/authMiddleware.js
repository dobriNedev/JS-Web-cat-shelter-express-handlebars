const config = require('../config/config');
const jwt = require('../utils/jwtUtil');
const { getError } = require('../utils/errorUtil');
const { checkIfUserIsOwner } = require('../manager/catManager');

exports.authenticate = async (req, res, next) => {
    const token = req.cookies[config.COOKIE_TOKEN_NAME];

    if (token) {
        try {
            const decodedToken = await jwt.verify(token, config.SECRET);
            req.user = decodedToken;
            res.locals.isAuth = true;
            res.locals.user = decodedToken;
        } catch (error) {
            res.clearCookie(config.COOKIE_TOKEN_NAME);
            res.status(401).render('login', { error: getError(error) });
        }
    }
    next();
};

exports.isAuthenticated = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).redirect('/auth/login');
    }
    next();
};

exports.isOwner = async (req, res, next) => {
    const catId = req.params.id;
    const currentUserId = req.user._id;

    // check if the currently logged in user is the owner of the cat with the given ID

    const isOwner = await checkIfUserIsOwner(catId, currentUserId);

    if (!isOwner) {
        return res.status(403).redirect('/');
    }

    next();
};

exports.isNotOwner = async (req, res, next) => {
    const catId = req.params.id;
    const currentUserId = req.user._id;

    // check if the currently logged in user is the owner of the cat with the given ID

    const isOwner = await checkIfUserIsOwner(catId, currentUserId);

    if (isOwner) {
        return res.status(403).redirect('/');
    }

    next();
};