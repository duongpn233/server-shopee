const Shoes = require('../models/Product');

const getShoes = async (req, res, next) => {
    try {
        const shoes = await Shoes.findOne({ _id: req.params.id });
        res.status(200).json(shoes);
    } catch (error) {
        next(error);
    }
};

const getAllShoes = async (req, res, next) => {
    try {
        if (req.query) {
            const shoes = await Shoes.find({
                name: {
                    $regex: req.query.name || '',
                    $options: "$i"
                }
            }).sort({
                [req.query._sort]: req.query._order
            })
            res.status(200).json({ shoes });
        }
        else {
            const shoes = await Shoes.find({});
            res.status(200).json({ shoes });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getShoes,
    getAllShoes
}