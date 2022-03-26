const express = require('express');
const router = express.Router();
const { getShop, getShops } = require('../controllers/shop');

router.get('/:id', getShop);

router.get('/', getShops);

module.exports = router;