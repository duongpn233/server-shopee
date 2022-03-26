const Cart = require('../models/Cart');

const getCartUser = async (req, res, next) => {
    try {
        console.log(req.user);
        const userId = req.user._id;
        const cartUser = await Cart.find({ userId: userId });
        res.status(200).json(cartUser);
    } catch (error) {
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ _id: req.params.id });
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const postCartUser = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            userId: req.user._id
        };
        const newCart = new Cart(data);
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        next(error);
    }
};

const deleteCartUser = async (req, res, next) => {
    try {
        await Cart.deleteOne({_id: req.params.id});
        res.status(201).json({
            success: true
        })
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCartUser,
    getCart,
    postCartUser,
    deleteCartUser
}