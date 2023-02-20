const config = require('../config/config');
const jwt = require('../utils/jwtUtil');

exports.authenticate = async(req,res,next) => {
    const token = req.cookie[config.COOKIE_TOKEN_NAME];

    if(token) {
        try {
            const decodedToken = await jwt.verify(token, config.SECRET);
            req.user = decodedToken;
            res.locals.isAuth = true;
            res.lokals.user = decodedToken;
        } catch (error) {
            res.clearCookie(config.COOKIE_TOKEN_NAME);
            res.status(401).redirect('/users/login');
        }
       
    }

    next();
};

exports.isAuthenticated = async(req, res, next) => {
    if (!req.user) {
        res.status(401).redirect('/users/login')
    }
    next();
};
