const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
    name: {
        type: String
    },
    img: {
        type: String
    },
    title: {
        type: String
    },
    follow: {
        type: Number,
        default: 0
    },
    numberOfFollowers: {
        type: Number,
        default: 0
    },
    evaluate: {
        type: Number,
        default: 0,
    },
    chatFeedback:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Shop = mongoose.model('Shop', ShopSchema);
module.exports = Shop;