const nodemailer = require("nodemailer");

const sendEmailOTP = (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS
            }
        });
        transporter.sendMail({
            from: process.env.EMAIL_ID,
            to: email,
            subject: subject,
            text: text
        }, (error, info) => {
            if (error) throw error;
            console.log(info);
        })
    } catch (error) {
        throw error;
    }
};

module.exports = sendEmailOTP;