const config = {
    production: {
        PORT: 1338
    },
    development: {
        PORT: 5001,
        //mongodb://localhost:27017/catShelter->desired collection name in MongoDB
        DB_URI: 'mongodb://localhost:27017/catShelter',
        //good practice is secret to be hashed
        SECRET: 'MyCatAppVerySecrettySecret',
        COOKIE_TOKEN_NAME: 'authToken'

    }
}

module.exports = config[process.env.node_env || 'development'];