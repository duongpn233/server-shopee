const express = require('express');
const router = express.Router();
const {getSearchHistory, postSearchHistory} = require('../controllers/searchHistory');

router.get('/', getSearchHistory);

router.post('/', postSearchHistory);

module.exports = router;
