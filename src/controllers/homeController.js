const MongoCat = require('../models/MongoCat');

exports.getHomePage = async (req, res) => {
    try {
        const cats = await MongoCat.find().populate('breed').lean();

        res.render('index', { cats });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getSearch = async(req, res) => {
    const query = req.query.search;

    try {
        //find all cats maching the regex, options -> i stands for case-aginsensitive
        const cats = await MongoCat.find({name: {$regex: new RegExp(query), $options: 'i'}})
        .populate('breed')
        .lean();
        
        res.render('index', { cats });
    } catch (error) {
        throw new Error(error);
    }
};


