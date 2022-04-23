const express = require('express');
const router = express.Router();
const { authGoogle, authFacebook, signIn, signUp, secret, update, sendCode, changePass } = require('../controllers/user');
const uploadAvt = require('../middleware/uploadImgs');
const passport = require('passport');
require('../middleware/passport');


router.post('/auth/google', passport.authenticate('google-token', { session: false }), authGoogle);

router.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), authFacebook)

router.post('/signin', signIn);

// router.post('/signin', passport.authenticate('local', {session: false}) , signIn);

router.post('/signup', signUp);

router.get('/secret', passport.authenticate('jwt', { session: false }), secret);

router.post('/update', passport.authenticate('jwt', { session: false }), uploadAvt.single('avtImg'), update);

router.get('/getcode', passport.authenticate('jwt', { session: false }), sendCode);

router.post('/changepass', passport.authenticate('jwt', { session: false }), changePass);

module.exports = router;