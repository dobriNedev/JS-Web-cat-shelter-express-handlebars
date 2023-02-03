const authManager = require('../manager/authManager');
const test = require('../testRequest');
exports.getLogin = async(req, res) => {
    res.render('login');
};

exports.postLogin = async(req, res) => {
    const { username, password} = req.body;

};

exports.getRegister = async(req, res) => {
    res.render('register');
};

exports.postRegister = async(req, res) => {
    const { firstName, lastName, username, email , password, repeatPassword } = req.body;
    //TO DO: think of validator function to validate the data in each field
    if (password !== repeatPassword) {
        res.status(404).send('<h2>Invalid username or password!</h2>').end();
    }
    const existingUser = await authManager.getUserByUsername(username);

    if (existingUser) {
        res.status(404).send('<h2>Invalid username or password!</h2>').end();
    }

    const user = await authManager.register(firstName, lastName, username, email , password);

    res.redirect('login');
};