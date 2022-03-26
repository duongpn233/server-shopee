const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    shopId: {
        type: Schema.Types.ObjectId
    },
    shoesId: {
        type: Schema.Types.ObjectId
    },
    imgItem: {
        type: String
    },
    itemName: {
        type: String
    },
    itemPrice: {
        type: Number
    },
    itemAmount: {
        type: Number
    },
    itemclassify: {
        type: String
    },
    itemSize: {
        type: Number
    }
})

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;