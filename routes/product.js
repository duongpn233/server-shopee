const express = require('express');
const router = express.Router();
const { getShoes, getAllShoes} = require('../controllers/product');

router.get('/', getAllShoes);

router.get('/:id', getShoes);


module.exports = router;