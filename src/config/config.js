const config = {
    production: {
        PORT: 1338
    },
    development: {
        PORT: 5001
    }
}

module.exports = config[proces.env.node_env || 'development'];