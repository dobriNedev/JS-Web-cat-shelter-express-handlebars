const MongoCat = require('../models/MongoCat');

exports.getHomePage = async (req, res) => {
    try {
        const cats = await MongoCat.find().populate('breed').lean();

        res.render('index', { cats });
    } catch (error) {
        throw new Error(error);
    }
};


