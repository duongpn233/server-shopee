const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        if (payload) {
            const id = payload.sub;
            const user = await User.findOne({ _id: id });
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

passport.use(new LocalStrategy({
    usernameField: "email",
    passswordField: "pass"
}, async (email, pass, done) => {
    try {
        const user = await User.findOne({
            email: email,
            authType: 'local'
        });
        console.log(user);
        if (!user) return done(new Error({
            message: 'correct account or password'
        }), false);
        const isValid = await user.isValidPass(pass);
        if (!isValid) return done(new Error({
            message: 'correct account or password'
        }), false);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        
        const email = profile.emails[0].value;
        const user = await User.findOne({
            email: email,
            authType: 'google'
        });
        if (user) done(null, user);
        else {
            const newUser = new User({
                email: email,
                userName: profile.displayName,
                authType: 'google'
            });
            
            await newUser.save();
            done(null, newUser);
        }
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const user = User.findOne({
            email: email,
            authType: 'facebook'
        });
        if (user) done(null, user);
        else {
            const newUser = new User({
                email: email,
                userName: profile.displayName,
                authType: 'facebook'
            });
            await newUser.save();
            done(null, newUser);
        }
    } catch (error) {
        done(error, false);
    }
}
));