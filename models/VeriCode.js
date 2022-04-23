const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    OTP: { type: String }
}, {
    timestamps: true
});

const VeriCode = mongoose.model('VeriCode', CodeSchema);
module.exports = VeriCode;