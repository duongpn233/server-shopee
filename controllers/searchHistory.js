const SearchHistory = require('../models/SearchHistory');

const getSearchHistory = async (req, res, next) => {
    try {
        if (req.query) {
            const history = await SearchHistory.find({
                title: {
                    $regex: req.query.title || '',
                    $options: "$i"
                }
            });
            res.status(200).json(history);
        }
        else {
            const history = await SearchHistory.find({});
            res.status(200).json(history);
        }
    } catch (error) {
        next(error);
    }
};

const postSearchHistory = async (req, res, next) => {
    try {
        const newSearch = new SearchHistory(req.body);
        await newSearch.save();
        res.status(201).json(newSearch);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSearchHistory,
    postSearchHistory
}

