const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoesSchema = new Schema({
    shopId: {
        type: Schema.Types.ObjectId
    },
    name : {
        type: String
    },
    img : {
        type: String
    },
    imgSlide : [{
        type: String
    }],
    oldPrice : {
        type: Number
    },
    newPrice : {
        type: Number
    },
    sale: {
        type: String
    },
    sold : {
        type: Number
    },
    like: {
        type: Boolean
    },
    brand: {
        type: String
    },
    origin: {
        type: String
    },
    amount : {
        type: Number
    },
    sizes: [{
        type: Object
    }]
})

const Shoes = mongoose.model('Shoes', ShoesSchema);
module.exports = Shoes;

