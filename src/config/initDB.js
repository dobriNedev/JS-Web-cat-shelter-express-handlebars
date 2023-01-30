const mongoose = require('mongoose');

const config = require('./config');

async function initDB() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.DB_URI);
    //in case we have a problem with the config.js we can use the connection string
    //await mongoose.connect('mongodb://localhost:27017/');
    console.log('MongoDB is connected');
}

module.exports = initDB;