const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    pass: {
        type: String
    },
    userName: {
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    sex: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    avtImg: {
        type: String
    },
    dateOfBirth: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number }
    }
})

UserSchema.pre('save', async function (next) {
    if (this.authType === 'local') {
        try {
            const salt = await bcryptjs.genSalt(10);
            const passHashed = await bcryptjs.hash(this.pass, salt);
            this.pass = passHashed;
            next();
        } catch (error) {
            next(error);
        }
    }
    else {
        next();
    }
});

UserSchema.method('isValidPass', async function (passClient) {
    try {
        return await bcryptjs.compare(passClient, this.pass);
    } catch (error) {
        throw new Error(error);
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
