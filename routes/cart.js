const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../middleware/passport');


const { getCartUser, getCart, postCartUser, deleteCartUser} = require('../controllers/cart');

router.get('/user', passport.authenticate('jwt', {session: false}), getCartUser);

router.get('/:id', getCart);

router.post('/', passport.authenticate('jwt', {session: false}), postCartUser);

router.delete('/:id', passport.authenticate('jwt', {session: false}), deleteCartUser);

module.exports = router;