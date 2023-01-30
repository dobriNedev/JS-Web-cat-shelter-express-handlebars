const config = {
    production: {
        PORT: 1338
    },
    development: {
        PORT: 5001,
        DB_URI: 'mongodb://localhost:27017/'
    }
}

module.exports = config[process.env.node_env || 'development'];