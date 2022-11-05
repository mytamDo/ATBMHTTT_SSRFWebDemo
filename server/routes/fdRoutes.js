const express = require('express');
const router = express.Router();
const fdController = require('../controllers/fdController');

router.get('/',fdController.homepage);

module.exports = router;