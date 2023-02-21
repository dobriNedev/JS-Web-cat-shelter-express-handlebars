const catManager = require('../manager/catManager');
const { getError } = require('../utils/errorUtil');

exports.getHomePage = async (req, res) => {
    try {
        const cats = await catManager.getAllNotShelterd().populate('breed').lean();

        res.render('index', { cats });
    } catch (error) {
        res.status(404).render('index', { error: getError(error) });
    }
};

exports.getSearch = async(req, res) => {
    const query = req.query.search;

    try {
        const cats = await catManager.search(query).populate('breed').lean();
        
        res.render('index', { cats });
    } catch (error) {
        res.status(404).render('index', { error: getError(error) });
    }
};


