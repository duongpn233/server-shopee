const User = require('../models/User');
const VeriCode = require('../models/VeriCode');
const Jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const sendEmailOTP = require('../middleware/sendEmail');

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
        return res.status(200).json({
            userName: userRes.userName,
            sex: userRes.sex,
            avtImg: userRes.avtImg,
            dateOfBirth: { ...userRes.dateOfBirth }
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        let userUpdate = {};
        
        if (req.file) {
            const linkAvt = process.env.LOCAL + `/imgs/users/avts/${req.file.filename}`;
            if(req.user.avtImg){
                const pathImg = req.user.avtImg;
                const imgName = pathImg.slice(pathImg.lastIndexOf('/') + 1);
                const pathFileRemove = path.join(__dirname, `../public/imgs/users/avts/${imgName}`);
                fs.unlink(pathFileRemove, function (err) {
                    if (err) return console.log(err);
                });
            }
            userUpdate = {
                ...req.body,
                avtImg: linkAvt,
                dateOfBirth: { ...JSON.parse(req.body.dateOfBirth) }
            };
        }
        else {
            userUpdate = {
                userName: req.body.userName,
                sex: req.body.sex,
                dateOfBirth: { ...JSON.parse(req.body.dateOfBirth) }
            };
        }
        const user = await User.findOneAndUpdate({ _id: req.user._id }, userUpdate, {
            new: true,
            runValidators: true
        });
        if (user) {
            const resData = {
                userName: user.userName,
                sex: user.sex,
                dateOfBirth: { ...user.dateOfBirth },
                avtImg: user.avtImg
            };
            return res.status(200).json(resData);
        }
    } catch (error) {
        next(error);
    }
};

const sendCode = async (req, res, next) => {
    try {
        if (req.user) {
            const code = Math.random().toString().substr(2, 6);
            const OTPCode = {
                userId: req.user._id,
                OTP: code
            };
            const checkOTP = await VeriCode.findOne({ userId: req.user._id });
            if (checkOTP) {
                await VeriCode.deleteOne({ _id: checkOTP._id });
            }
            const newOTP = new VeriCode(OTPCode);
            newOTP.save();
            sendEmailOTP(req.user.email, "Please verify your device", "Verification code: " + code);
            return res.status(200).json({
                success: true
            });
        }
        else {
            return res.status(401).json({
                error: {
                    message: 'Login session has expired'
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

const changePass = async (req, res, next) => {
    try {
        if (req.user && req.user.authType === "local") {
            const dateNow = new Date();
            const OTPClient = req.body.OTP;
            const OTPSv = await VeriCode.findOne({ userId: req.user._id });
            if (OTPSv && OTPClient === OTPSv.OTP) {
                const dateOTP = OTPSv._id.getTimestamp();
                if ((dateNow.getTime() - dateOTP.getTime()) <= 120000) {
                    const user = await User.findOne({ _id: req.user._id });
                    user.pass = req.body.pass;
                    await user.save();
                    await VeriCode.deleteOne({ _id: OTPSv._id });
                    return res.status(200).json({ success: true });
                }
                else {
                    await VeriCode.deleteOne({ _id: OTPSv._id });
                    return res.status(400).json({
                        error: {
                            successs: false,
                            message: "OTP timeout"
                        }
                    });
                }
            }
            else {
                return res.status(400).json({
                    error: {
                        successs: false,
                        message: "OTP code is incorrect"
                    }
                });
            }
        }
        else if (req.user && req.user.authType !== "local") {
            return res.status(401).json({
                error: {
                    successs: false,
                    message: "Login account is google account"
                }
            });
        }
        else {
            return res.status(401).json({
                error: {
                    successs: false,
                    message: 'Login session has expired'
                }
            });
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {
    authGoogle,
    authFacebook,
    signIn,
    signUp,
    secret,
    update,
    sendCode,
    changePass
}