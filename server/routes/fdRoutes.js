const express = require('express');
const router = express.Router();
const fdController = require('../controllers/fdController');
const checkLogin = require('../utils/checkLogin');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

router.get('/', fdController.homepage);
router.get('/login', fdController.login);
router.post('/login', fdController.loginOnPost);
router.get('/register', fdController.register);
router.post('/register', fdController.registerOnPost);
router.get('/must-login', fdController.mustLogin);

//Shipper router
router.get('/shipper', checkLogin.checkShipper, fdController.client);

//Admin router
router.get(
  '/admin-dashboard',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminDashboard
);
router.get('/admin-drinks', checkLogin.checkLogin, checkLogin.checkAdmin, fdController.adminDrinks);
router.get('/admin-foods', checkLogin.checkLogin, checkLogin.checkAdmin, fdController.adminFoods);

//food
router.get('/admin-info', checkLogin.checkLogin, checkLogin.checkAdmin, fdController.adminInfo);
router.get(
  '/admin-add-food',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminAddFood
);
router.post(
  '/admin-add-food',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  upload.single('image'),
  fdController.adminAddFoodOnPost
);
router.get(
  '/admin-update-food/:id',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminUpdateFood
);
router.post(
  '/admin-update-food/:id',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  upload.single('image'),
  fdController.adminUpdateFoodOnPost
);
router.post(
  '/admin-delete-food/:id',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminDeleteFoodOnPost
);

//drink
router.get(
  '/admin-add-drink',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminAddDrink
);
router.post(
  '/admin-add-drink',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  upload.single('image'),
  fdController.adminAddDrinkOnPost
);
router.get(
  '/admin-update-drink/:id',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminUpdateDrink
);
router.post(
  '/admin-update-drink/:id',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  upload.single('image'),
  fdController.adminUpdateDrinkOnPost
);
router.post(
  '/admin-delete-drink/:id',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminDeleteDrinkOnPost
);
router.get(
  '/admin-show-staff-list',
  checkLogin.checkLogin,
  checkLogin.checkAdmin,
  fdController.adminShowStaffList
);
//Client router
router.get('/client', checkLogin.checkLogin, checkLogin.checkClient, fdController.client);
router.get('/info', checkLogin.checkLogin, checkLogin.checkClient, fdController.clientInfo);
router.get('/product/:id', checkLogin.checkLogin, checkLogin.checkClient, fdController.product);
router.get('/cart', checkLogin.checkLogin, checkLogin.checkClient, fdController.clientCart);
router.get('/pay/:id', checkLogin.checkLogin, checkLogin.checkClient, fdController.clientPay);
router.get('/foods', checkLogin.checkLogin, checkLogin.checkClient, fdController.clientFoods);
router.post(
  '/add-cart/:id',
  checkLogin.checkLogin,
  checkLogin.checkClient,
  fdController.addCartOnPost
);
// router.get('/buy', fdController.buyOne);
// router.post('/create-invoice', fdController.createInvoiceSingle);
module.exports = router;
