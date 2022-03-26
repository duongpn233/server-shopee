const User = require('../models/User');
const Jwt = require('jsonwebtoken');

const encoder = (userId) => {
    return Jwt.sign({
        iss: 'Ngoc Duong',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setTime((new Date().getTime()) + 259200)
    }, process.env.JWT_SECRET)
};

const authGoogle = (req, res, next) => {
    try {
        const user = req.user;
        const token = encoder(user._id);
        return res.status(201).json({ token: token });
    } catch (error) {
        next(error);
    }
};

const authFacebook = (req, res, next) => {
    try {
        const user = req.user;
        const token = encoder(user._id);
        res.setHeader('Authorization', token);
        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}

const signIn = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            authType: 'local'
        });
        console.log(user);
        if (!user) return next(new Error('correct account or password'));
        const isValid = await user.isValidPass(req.body.pass);
        if (!isValid) return next(new Error('correct account or password'));
        const token = encoder(user._id);
        return res.status(201).json({ token: token });
    } catch (error) {
        next(error);
    }
};

const signUp = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new User(req.body);
            await newUser.save();
            const token = encoder(newUser._id);
            return res.status(201).json({ token: token });
        }
        else {
            return res.status(403).json({
                error: {
                    message: 'Email already exists'
                }
            })
        }
    } catch (error) {
        next(error);
    }
};

const secret = (req, res, next) => {
    try {
        const userRes = req.user;
        console.log(userRes)
        return res.status(200).json({ userName: userRes.userName });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    authGoogle,
    authFacebook,
    signIn,
    signUp,
    secret
}