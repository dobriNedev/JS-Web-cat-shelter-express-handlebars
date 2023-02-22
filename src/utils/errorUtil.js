const mongoose = require('mongoose');

function getFirstMongooseError(error) {
    const firstError = Object.values(error.errors)[0].message;
    return firstError;
}

exports.getError = (error) => {

    switch (error.name) {
        case 'Error':
            return error.message;
        case 'ValidationError':
            return getFirstMongooseError(error);
        case 'MongoServerError':
            return 'Already exists';
        default:
            return error.message;
    }
};