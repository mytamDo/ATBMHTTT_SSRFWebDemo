const express = require('express');
const router = express.Router();
const fdController = require('../controllers/fdController');

router.get('/',fdController.homepage);
router.get('/login',fdController.login);
router.get('/register',fdController.register)

module.exports = router;