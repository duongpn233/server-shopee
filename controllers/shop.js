const Shop = require('../models/Shop');

const getShop = async (req, res, next) => {
    try {
        const shop = await Shop.findOne({ _id: req.params.id });
        res.status(200).json(shop);
    } catch (error) {
        next(error);
    }
};

const getShops = async (req, res, next) => {
    try {
        if (req.query) {
            const shops = await Shop.find({
                name: {
                    $regex: req.query.name || '',
                    $options: "$i"
                }
            });
            res.status(200).json(shops);
        }
        else {
            const shops = await Shop.find({});
            res.status(200).json(shops);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getShop,
    getShops
}