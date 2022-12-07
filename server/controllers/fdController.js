require('../models/database');
const { reset } = require('nodemon');
const jwt = require('jsonwebtoken');
const { findOne, findById } = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Client');
const Shipper = require('../models/Shipper');
const Cart2 = require('../models/Cart2');
const Invoice = require('../models/Invoice');

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 4;
    const foods = await Product.find({ type: 'food' }).sort({ _id: -1 }).limit(limitNumber);
    const drinks = await Product.find({ type: 'drink' }).sort({ _id: -1 }).limit(limitNumber);
    // const users = await User.find({});
    res.render('index', { title: 'F&D - Homepage', foods, drinks });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET / product
 * product
 */
exports.product = async (req, res) => {
  try {
    const productID = req.params.id;
    const query = { _id: productID };
    await Product.findOne(query).then((data) => {
      res.render('product', {
        title: 'F&D - Clients Info',
        data,
      });
    });
  } catch (error) {
    console.log('Error product');
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /login
 * login
 */
exports.login = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoLoginObj = req.flash('infoLogin');
    res.render('login', { title: 'F&D - Login', infoErrorsObj, infoLoginObj });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * POST/login
 * login on post
 */

exports.loginOnPost = async (req, res, next) => {
  try {
    var email = req.body.email;
    var pass = req.body.password;
    var user = await User.findOne({
      email: email,
      pass: pass,
    })
      .then((data) => {
        if (data) {
          var token = jwt.sign({ _id: data._id }, 'mk');
          res.cookie('token', token, {
            maxAge: 604800000,
          });
          if (data.role == 2) {
            req.flash('infoLogin', 'Login Success');
            console.log('OK');
            res.redirect('/admin-dashboard');
          } else {
            req.flash('infoLogin', 'Login Success');
            console.log('OK');
            res.redirect('/info');
          }
        } else {
          req.flash('infoErrors', 'Something wrong');
          console.log('Error, something wrong with account');
          res.redirect('/login');
        }
      })
      .catch((err) => {
        req.flash('infoErrors', 'Something wrong with account');
        console.log('Error, something wrong with account');
        res.redirect('/login');
      });
  } catch (error) {
    console.log('Sever error');
    res.redirect('/login');
  }
};

/**
 * GET /register
 * register
 */
exports.register = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoRegisterObj = req.flash('infoRegister');
    res.render('register', { title: 'F&D - Register', infoErrorsObj, infoRegisterObj });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * POST /register
 * register on post
 */
exports.registerOnPost = async (req, res) => {
  try {
    var email = req.body.email;
    var pass = req.body.password;
    var name = req.body.name;
    var gender = req.body.gender;
    var address = req.body.address;
    var tel = req.body.tel;
    var cfmPass = req.body.confirmPassword;
    User.findOne({
      email: email,
    }).then((data) => {
      if (data) {
        req.flash('infoErrors', 'Register failed, Email existed');
        res.redirect('/register');
        console.log('Loi dang ky');
      } else if (cfmPass == pass) {
        User.create({
          email: email,
          pass: pass,
          role: 0,
        });
        Client.create({
          email: email,
          name: name,
          gender: gender,
          address: address,
          tel: tel,
        });
        req.flash('infoRegister', 'Register Success');
        console.log('OK');
        res.redirect('/register');
      } else {
        req.flash('infoErrors', 'Register failed, Wrong confirm password');
        res.redirect('/register');
        console.log('Loi dang ky');
      }
    });
  } catch (error) {
    req.flash('infoErrors', 'Register failed');
    res.redirect('/register');
    console.log('Sever Error');
  }
};

// insertDymmyCartData();
async function insertDymmyCartData() {
  try {
    await Cart2.insertMany([
      {
        product_id: ['a', 'b'],
        client_id: 'abc',
      },
    ]);
  } catch (error) {
    console.log('err', +error);
  }
}
//insert for the first time
async function insertDymmyUserData() {
  try {
    await User.insertMany([
      {
        email: 'ttphong071016@gmail.com',
        pass: '123123',
        role: 2,
      },
    ]);
  } catch (error) {
    console.log('err', +error);
  }
}
//insert for the first time
async function insertDymmyClientData() {
  try {
    await Client.insertMany([
      {
        email: 'tranphonglq@gmail.com',
        name: 'Tran Thanh Phong',
        gender: 'male',
        address: 'Linh Trung, Thu Duc, Ho Chi Minh City',
        avatar_link: './uploads/God.jpg',
      },
    ]);
  } catch (error) {
    console.log('err1', error);
  }
}

// insertDymmyUserData();
// insertDymmyClientData();

// user view

/**
 * GET /clients
 * clients view
 */
exports.client = async (req, res) => {
  try {
    const limitNumber = 4;
    const foods = await Product.find({ type: 'food' }).sort({ _id: -1 }).limit(limitNumber);
    const drinks = await Product.find({ type: 'drink' }).sort({ _id: -1 }).limit(limitNumber);
    // const users = await User.find({});
    res.render('client-index', {
      layout: './layouts/client',
      title: 'F&D - Clients',
      foods,
      drinks,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /info
 * client info view
 */
exports.clientInfo = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoLoginObj = req.flash('infoLogin');
    const infoObj = req.flash('infoSubmit');

    // console.log(req.data);
    const token = req.cookies.token;
    const clientID = jwt.verify(token, 'mk');
    var user = await User.findOne({
      _id: clientID,
    });
    var data = await Client.findOne({
      email: user.email,
    });
    var status = [];
    if (data) {
      var invoices = await Invoice.find({ client: data._id }).sort({ _id: -1 });

      res.render('client-info', {
        layout: './layouts/client',
        title: 'F&D - Clients Info',
        data,
        invoices,
        infoErrorsObj,
        infoLoginObj,
        infoObj,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Error Occured', infoErrorsObj, infoLoginObj });
  }
};

/**
 * GET /product
 * product view
 */
exports.clientProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const query = { _id: productID };
    await Product.findOne(query).then((data) => {
      res.render('client-product', {
        layout: './layouts/client',
        title: 'F&D - Clients Info',
        data,
      });
    });
  } catch (error) {
    console.log('Error product');
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /foods
 * get client with foods
 */
exports.clientFoods = async (req, res, next) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    const foods = await Product.find({ type: 'food' }).sort({ _id: -1 });
    res.render('client-foods', {
      title: 'F&D - Client foods',
      layout: './layouts/client',
      foods,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * GET /drinks
 * get client with foods
 */
exports.clientDrinks = async (req, res, next) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    const drinks = await Product.find({ type: 'drink' }).sort({ _id: -1 });
    res.render('client-drinks', {
      title: 'F&D - Client drinks',
      layout: './layouts/client',
      drinks,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /cart
 * get cart view
 */
exports.clientCart = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = await Client.findOne({ email: user.email });
    const query = { client_id: client._id };
    const cart = await Cart2.findOne(query);
    const productList = [];
    if (cart) {
      for (let i in cart.product_obj) {
        productList.push(await Product.findOne({ _id: cart.product_obj[i].product_id }));
      }
      // console.log(productList);
      let total = 0;
      productList.forEach(function (product, index) {
        total += product.price * cart.product_obj[index].count;
      });
      res.render('client-cart', {
        layout: './layouts/client',
        title: 'F&D - Clients Cart',
        productList,
        cart,
        total,
      });
    } else {
      res.render('client-cart', {
        layout: './layouts/client',
        title: 'F&D - Clients Cart',
        total: 0,
        productList,
      });
    }
  } catch (error) {
    console.log('Error product');
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * Post /add cart
 * add cart by ID on post
 */
exports.addCartOnPost = async (req, res) => {
  try {
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = await Client.findOne({ email: user.email });
    var productID = req.params.id;
    var product = await Product.findOne({ _id: productID });
    const count = 0;
    const tempCart = await Cart2.findOne({
      client_id: client._id,
    });

    if (tempCart == null) {
      const cart = new Cart2({
        client_id: client._id,
        product_obj: {
          product_id: productID,
          count: 1,
        },
      });
      await cart.save();
    } else {
      let product_obj = tempCart.product_obj;
      let flag = 0;
      product_obj.forEach((product, index) => {
        if (product.product_id == productID) {
          flag = 1;
          product_obj[index].count = parseInt(product_obj[index].count) + 1;
        }
      });
      await Cart2.findOneAndUpdate(
        { client_id: client._id },
        {
          product_obj: product_obj,
        }
      );
      if (flag == 0) {
        await Cart2.findOneAndUpdate(
          { client_id: client._id },
          {
            $push: {
              product_obj: {
                $each: [{ product_id: productID, count: 1 }],
                $position: 0,
              },
            },
          }
        );
      } else {
      }
    }
    req.flash('infoSubmit', 'cart has been updated.');
    if (product.type == 'food') {
      res.redirect('/foods');
    } else {
      res.redirect('/drinks');
    }
  } catch (error) {
    console.log(error);
    req.flash('infoErrors', 'Fail to update');
    res.redirect(url);
  }
};
/**
 * POST /update-cart
 * Update cart on post
 */
exports.updateCartOnPost = async (req, res) => {
  try {
    var token = req.cookies.token;
    const product_id = req.params.id;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = await Client.findOne({ email: user.email });
    var cart = await Cart2.findOne({ client_id: client._id });
    const count = req.body.quantity;
    // console.log(cart.product_obj);
    var flag = 0; //if count = 0, flag will on.
    for (let i in cart.product_obj) {
      if (cart.product_obj[i].product_id == product_id) {
        cart.product_obj[i].count = count;
        if (count == 0) {
          flag = 1;
        }
      }
    }
    await Cart2.findOneAndUpdate(
      { client_id: client._id },
      {
        product_obj: cart.product_obj,
      }
    );
    if (flag == 1) {
      await Cart2.findOneAndUpdate(
        { _id: cart._id },
        { $pull: { product_obj: { product_id: product_id } } }
      );
    }
    res.redirect('/cart');
  } catch (error) {
    console.log('Error add cart');
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * GET /remove-cart/:id/:cid
 * remove item on the cart
 */
exports.removeItemCart = async (req, res) => {
  try {
    const cartID = req.params.cid;
    const productID = req.params.id;
    console.log(cartID, productID);
    var Cart = await Cart2.findOneAndUpdate(
      { _id: cartID },
      { $pull: { product_obj: { product_id: productID } } }
    );
    res.redirect('/cart');
  } catch (error) {
    console.log('Error add cart');
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /create-invoice/:id
 * create-invoice
 */
exports.createInvoice = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = await Client.findOne({ email: user.email });
    const cart_id = req.params.id;
    const query = { _id: cart_id };
    const cart = await Cart2.findOne(query);
    var total = 0;
    var productList = [];
    cart.product_obj.forEach((product_id, index) => {});
    var product_obj = cart.product_obj;
    for (let i in cart.product_obj) {
      productList.push(await Product.findOne({ _id: product_obj[i].product_id }));
      total += productList[i].price * product_obj[i].count;
    }

    res.render('client-invoice', {
      title: 'F&D - client-history-invoice',
      layout: './layouts/client',
      productList,
      total,
      cart,
      client,
      infoObj,
      infoErrorsObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * POST /create-invoice/:id
 * create-invoice on POST
 */
exports.createInvoiceOnPost = async (req, res) => {
  const cartId = req.body.cart_id;
  url = '/create-invoice/' + cartId;
  try {
    const cart = await Cart2.findOne({ _id: cartId });
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var product_obj = cart.product_obj;
    var productList = [];
    var items = [];
    for (let i in cart.product_obj) {
      productList.push(await Product.findOne({ _id: product_obj[i].product_id }));
      items.push({
        name: productList[i].name,
        count: product_obj[i].count,
        price: productList[i].price,
      });
      console.log(items[i]);
    }
    var createTime = req.body.createTime;
    var value = parseInt(req.body.value);
    var client = await Client.findOne({ email: user.email });
    var deliveryAddress = req.body.address;
    var phoneNumber = req.body.tel;
    const invoice = Invoice.create({
      createTime: createTime,
      items: items,
      value: value,
      client: client._id,
      deliveryAddress: deliveryAddress,
      phoneNumber: phoneNumber,
      status: 1,
    });
    req.flash('infoSubmit', 'Create invoice successfully');
    res.redirect(url);
  } catch (error) {
    console.log(error);
    req.flash('infoErrors', 'Fail to create the invoice');
    res.redirect(url);
  }
};

/**
 * get/history-invoice
 * create-invoice on POST
 */
exports.invoice = async (req, res) => {
  try {
    const invoice_id = req.params.id;
    const token = req.cookies.token;
    const userID = jwt.verify(token, 'mk');
    const user = await User.findOne({ _id: userID });
    const client = await Client.findOne({ email: user.email });
    var invoice = await Invoice.findOne({ _id: invoice_id });
    var status = getstatus(invoice.status);
    res.render('client-view-invoice', {
      title: 'F&D - client-invoice',
      layout: './layouts/client',
      invoice,
      client,
      status,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

function getstatus(sttnum) {
  if (sttnum == 1) {
    return 'Created, Waiting for confirmation';
  } else if (sttnum == 2) {
    return 'Confirmed, Waiting for getting the products';
  } else if (sttnum == 3) {
    return 'Got the products, waiting for delivery';
  } else if (sttnum == 4) {
    return 'Order is done, thank you for using our service';
  } else {
    return 'Canceled';
  }
}

/**
 * POST /cancle/:id
 * cancle order on POST
 */
exports.cancelOrder = async (req, res) => {
  try {
    await Invoice.findOneAndUpdate({ _id: req.params.id }, { status: 0 });
    req.flash('infoSubmit', 'Cancel successfully');
    res.redirect('/info');
  } catch (error) {
    console.log(error);
    req.flash('infoErrors', 'Fail to cancel');
    res.redirect('/info');
  }
};
// /**
//  * GET /shiper
//  * clients view
//  */
//  exports.clients = async (req, res) => {
//   try {
//     console.log(req.data);
//     res.render('index', { title: 'F&D - Register' });
//   } catch (error) {
//     res.status(500).send({ message: error.message || 'Error Occured' });
//   }
// };

//admin
/**
 * GET /admin-dashboard
 * admin view
 */
exports.adminDashboard = async (req, res, next) => {
  try {
    res.render('admin-dashboard', { layout: './layouts/admin', title: 'F&D - Admon dashboard' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * GET /admin-drinks
 * admin drinks
 */
exports.adminDrinks = async (req, res, next) => {
  try {
    const drinks = await Product.find({ type: 'drink' });
    res.render('admin-drinks', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      drinks,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * GET /admin-foods
 * admin foods
 */
exports.adminFoods = async (req, res, next) => {
  try {
    const foods = await Product.find({ type: 'food' });
    res.render('admin-foods', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      foods,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /admin-info
 * admin info
 */
exports.adminInfo = async (req, res, next) => {
  try {
    res.render('admin-info', { layout: './layouts/admin', title: 'F&D - Admin dashboard' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * GET /admin-add-food
 * admin add food
 */
exports.adminAddFood = async (req, res, next) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');

    res.render('admin-add-food', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /admin-add-drink
 * admin add drink
 */
exports.adminAddDrink = async (req, res, next) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');

    res.render('admin-add-drink', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * POST/admin-add-food
 * admin add food on post
 */
exports.adminAddFoodOnPost = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      type: 'food',
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save food
    await newProduct.save();
    req.flash('infoSubmit', 'Product has been add.');
    res.redirect('/admin-add-food');
  } catch (error) {
    req.flash('infoErrors', 'Fail to add');
    res.redirect('/admin-add-food');
  }
};

/**
 * POST/admin-add-drink
 * admin add drink on post
 */
exports.adminAddDrinkOnPost = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      type: 'drink',
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save drink
    await newProduct.save();
    req.flash('infoSubmit', 'Product has been add.');
    res.redirect('/admin-add-drink');
  } catch (error) {
    req.flash('infoErrors', 'Fail to add');
    res.redirect('/admin-add-drink');
  }
};

/**
 * GET/update-food
 * Update food
 */
exports.adminUpdateFood = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    const foodID = req.params.id;
    const food = await Product.findById(foodID);
    res.render('admin-update-food', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      infoErrorsObj,
      infoObj,
      food,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/update-drink
 * Update drink
 */
exports.adminUpdateDrink = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    const drinkID = req.params.id;
    const drink = await Product.findById(drinkID);
    res.render('admin-update-drink', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      infoErrorsObj,
      infoObj,
      drink,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * POST/update-food
 * Update food on post
 */
exports.adminUpdateFoodOnPost = async (req, res) => {
  const url = '/admin-update-food/' + req.params.id;
  try {
    const foodID = req.params.id;
    const query = { _id: foodID };
    const food = await Product.findById(query);
    await cloudinary.uploader.destroy(food.cloudinary_id);
    console.log('destroy img sucess');
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('upload new img sucess');
    await Product.findOneAndUpdate(query, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
    });
    req.flash('infoSubmit', 'Product has been updated.');
    res.redirect(url);
  } catch (error) {
    console.log(error);
    req.flash('infoErrors', 'Fail to update');
    res.redirect(url);
  }
};

/**
 * POST/update-drink
 * Update drink on post
 */
exports.adminUpdateDrinkOnPost = async (req, res) => {
  const url = '/admin-update-drink/' + req.params.id;
  try {
    const drinkID = req.params.id;
    const query = { _id: drinkID };
    const drink = await Product.findById(query);
    await cloudinary.uploader.destroy(drink.cloudinary_id);
    console.log('destroy img sucess');
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('upload new img sucess');
    await Product.findOneAndUpdate(query, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
    });
    req.flash('infoSubmit', 'Product has been updated.');
    res.redirect(url);
  } catch (error) {
    console.log(error);
    req.flash('infoErrors', 'Fail to update');
    res.redirect(url);
  }
};

/**
 * POST/delete-food
 * Delete food on post
 */
exports.adminDeleteFoodOnPost = async (req, res) => {
  const url = '/admin-foods';

  try {
    query = { _id: req.params.id };
    const food = await Product.findOne(query);
    await cloudinary.uploader.destroy(food.cloudinary_id);
    console.log('destroy img sucess');
    await Product.findOneAndDelete(query);
    req.flash('infoDelete', 'Product has been deleted.');
    res.redirect(url);
  } catch (error) {
    console.log(error);
    req.flash('infoDeleteErrors', 'Fail to delete food');
    res.redirect(url);
  }
};

/**
 * POST/delete-drink
 * Delete drink on post
 */
exports.adminDeleteDrinkOnPost = async (req, res) => {
  const url = '/admin-drinks';

  try {
    query = { _id: req.params.id };
    const drink = await Product.findOne(query);
    await cloudinary.uploader.destroy(drink.cloudinary_id);
    console.log('destroy img sucess');
    await Product.findOneAndDelete(query);
    req.flash('infoDelete', 'Product has been deleted.');
    res.redirect(url);
  } catch (error) {
    console.log(error);
    req.flash('infoDeleteErrors', 'Fail to delete drink');
    res.redirect(url);
  }
};

/**
 * GET/admin-show-staff-list
 * Admin show staff list
 */
exports.adminShowStaffList = async (req, res) => {
  try {
    shippers = await Shipper.find({}).sort({ status: 1 });
    res.render('admin-show-staff-list', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      shippers,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-today-invoices
 * Admin view today invoices
 */
exports.adminViewTodayInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const start = new Date();
    const end = new Date();
    console.log(start);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const invoices = await Invoice.find({ createTime: { $gte: start, $lt: end } }).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    const cancel = 0;
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      cancel,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-all-invoices
 * Admin view all invoices
 */
exports.adminViewAllInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const invoices = await Invoice.find({}).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    const cancel = 0;
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      cancel,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-ordered-invoices
 * Admin view ordered invoices
 */
exports.adminViewOrderedInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const invoices = await Invoice.find({ status: 1 }).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    const cancel = 0;
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      cancel,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-confiermed-invoices
 * Admin view confiermed invoices
 */
exports.adminViewConfirmedInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const invoices = await Invoice.find({ status: 2 }).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    const cancel = 0;
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      cancel,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-got-invoices
 * Admin view got items invoices
 */
exports.adminViewGotItemsInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const invoices = await Invoice.find({ status: 3 }).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    var cancel = 0;
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      cancel,
      infoErrorsObj,
      infoObj,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-done-invoices
 * Admin view done invoices
 */
exports.adminViewDoneInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const cancel = 0;
    const invoices = await Invoice.find({ status: 4 }).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      infoErrorsObj,
      cancel,
      infoObj,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-canceled-invoices
 * Admin view canceled invoices
 */
exports.adminViewCanceledInvoices = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoObj = req.flash('infoSubmit');
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = [];
    const invoices = await Invoice.find({ status: 0 }).sort({ _id: 1 });
    for (i in invoices) {
      client.push(await Client.findOne({ _id: invoices[i].client }));
    }
    const cancel = 1;
    res.render('admin-invoices', {
      layout: './layouts/admin',
      title: 'F&D - Admin dashboard',
      invoices,
      client,
      infoErrorsObj,
      infoObj,
      cancel,
    });
  } catch (error) {
    console.log('wrong view?');
    res.status(500).send({ mesage: error.message || 'Error Occured' });
  }
};

/**
 * GET/admin-canceled-invoices
 * Admin view canceled invoices
 */
exports.adminViewInvoice = async (req, res) => {
  try {
    const invoice_id = req.params.id;
    var invoice = await Invoice.findOne({ _id: invoice_id });
    const client = await Client.findOne({ _id: invoice.client });
    var staNum = invoice.status;
    var status = getstatusAd(invoice.status);
    console.log(invoice, client);
    res.render('admin-invoice', {
      title: 'F&D - client-invoice',
      layout: './layouts/admin',
      invoice,
      staNum,
      client,
      status,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
function getstatusAd(sttnum) {
  if (sttnum == 1) {
    return 'Created';
  } else if (sttnum == 2) {
    return 'Confirmed';
  } else if (sttnum == 3) {
    return 'Got the products';
  } else if (sttnum == 4) {
    return 'Done';
  } else {
    return 'Canceled';
  }
}

// error view
/**
 * GET /must-login
 * musst login
 */
exports.mustLogin = async (req, res, next) => {
  try {
    res.render('must-login', { title: 'F&D - Err' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

// async function insertDymmyShipperData() {
//   try {
//     await Shipper.insertMany([
//       {
//         name: 'Tran Van B',
//         birthday: '08/04/2002',
//         begin: new Date(),
//         status: 'Done',
//       },
//       {
//         name: 'Tran Van C',
//         birthday: '08/04/2002',
//         begin: new Date(),
//         status: 'Working',
//       },
//       {
//         name: 'Tran Van D',
//         birthday: '08/04/2002',
//         begin: new Date(),
//         status: 'Done',
//       },
//     ]);
//   } catch (error) {
//     console.log('err', error);
//   }
// }
