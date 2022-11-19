const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fdController = require('../controllers/fdController');
const checkLogin = require('../utils/checkLogin');

router.get('/', fdController.homepage);
router.get('/login', fdController.login);
router.post('/login', fdController.loginOnPost);
router.get('/register', fdController.register);
router.post('/register', fdController.registerOnPost);
router.get('/clients', checkLogin.checkLogin, checkLogin.checkClient, fdController.clients);
router.get('/shipper', checkLogin.checkShipper, fdController.clients);
router.get(
  '/admin-dashboard',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminDashboard
);
router.get('/must-login', fdController.mustLogin);

module.exports = router;
