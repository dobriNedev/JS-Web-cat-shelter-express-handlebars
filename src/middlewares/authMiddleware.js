const config = require('../config/config');
const jwt = require('../utils/jwtUtil');
const { getError }  = require('../utils/errorUtil');

exports.authenticate = async(req,res,next) => {
    const token = req.cookies[config.COOKIE_TOKEN_NAME];

    if(token) {
        try {
            const decodedToken = await jwt.verify(token, config.SECRET);
            console.log('decodedToken AT AUTHENTICATE:')
            console.log(decodedToken)
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

exports.isAuthenticated = async(req, res, next) => {
    if (!req.user) {
        const error = new Error('Only for authenticated users! Please log in!')
        return res.status(401).render('login', { error: getError(error) });
    }
    next();
};
