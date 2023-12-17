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
router.get('/product/:id', fdController.product);

//Shipper router
router.get('/shipper', fdController.shipper);
router.get('/staff-view-invoice/:id', fdController.staffViewInvoice);
router.get(
  '/staff-view-delivering-invoice/:id',
  fdController.staffViewDeliveringInvoice
);
router.get('/finish-dilivering/:id', fdController.staffFinishDilivering);

//Admin router
router.get('/admin-dashboard', fdController.adminDashboard);
router.get('/admin-drinks', fdController.adminDrinks);
router.get('/admin-foods', fdController.adminFoods);

//food
router.get('/admin-info', fdController.adminInfo);
router.get('/admin-add-food', fdController.adminAddFood);
router.post(
  '/admin-add-food',
  upload.single('image'),
  fdController.adminAddFoodOnPost
);
router.get('/admin-update-food/:id', fdController.adminUpdateFood);
router.post(
  '/admin-update-food/:id',
  upload.single('image'),
  fdController.adminUpdateFoodOnPost
);
router.post('/admin-delete-food/:id', fdController.adminDeleteFoodOnPost);

//drink
router.get('/admin-add-drink', fdController.adminAddDrink);
router.post(
  '/admin-add-drink',
  upload.single('image'),
  fdController.adminAddDrinkOnPost
);
router.get('/admin-update-drink/:id', fdController.adminUpdateDrink);
router.post(
  '/admin-update-drink/:id',
  upload.single('image'),
  fdController.adminUpdateDrinkOnPost
);
router.post('/admin-delete-drink/:id', fdController.adminDeleteDrinkOnPost);
router.get('/admin-show-staff-list', fdController.adminShowStaffList);
router.get('/admin-add-staff', fdController.adminAddStaff);
router.post('/admin-add-staff', fdController.adminAddStaffOnPost);
router.get('/admin-today-invoices', fdController.adminViewTodayInvoices);
router.get('/admin-all-invoices', fdController.adminViewAllInvoices);
router.get('/admin-ordered-invoices', fdController.adminViewOrderedInvoices);
router.get(
  '/admin-confirmed-invoices',
  fdController.adminViewConfirmedInvoices
);
router.get('/admin-got-invoices', fdController.adminViewGotItemsInvoices);
router.get('/admin-done-invoices', fdController.adminViewDoneInvoices);
router.get('/admin-canceled-invoices', fdController.adminViewCanceledInvoices);
router.get('/admin-view-invoice/:id', fdController.adminViewInvoice);
router.get(
  '/admin-delete-canceled-invoices',
  fdController.adminDeleteCanceledInvoice
);
router.post('/admin-arrange-staff/:id', fdController.adminArangeStaffOnPost);
router.get('/admin-confirm-invoice/:id', fdController.adminConfirmInvoice);

//Client router
router.get('/client', fdController.client);
router.get('/info', fdController.clientInfo);
router.get('/client-product/:id', fdController.clientProduct);
router.get('/cart', fdController.clientCart);
router.get('/foods', fdController.clientFoods);
router.get('/drinks', fdController.clientDrinks);
router.get('/all', fdController.clientAllProduct);
router.post('/search', fdController.searchRecipe);
router.post('/add-cart-ajax', fdController.addCartAjax);
router.post('/add-cart/:id', fdController.addCartOnPost);
router.post('/update-cart/:id', fdController.updateCartOnPost);
router.get('/remove-cart/:id/:cid', fdController.removeItemCart);
router.get('/create-invoice/:id', fdController.createInvoice);
router.post('/create-invoice', fdController.createInvoiceOnPost);
router.get('/invoice/:id', fdController.invoice);
router.get('/cancel/:id', fdController.cancelOrder);

// router.get('/buy', fdController.buyOne);
// router.post('/create-invoice', fdController.createInvoiceSingle);
module.exports = router;
