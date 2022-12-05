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
const Cart = require('../models/Cart');
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

async function insertDymmyCartData() {
  try {
    await Cart.insertMany([
      {
        product_id: ['a', 'b'],
        client_id: 'abc',
      },
    ]);
  } catch (error) {
    console.log('err', +error);
  }
}
// insertDymmyCartData();

// /**
//  * GET /buyone
//  * register
//  */
// exports.buyOne = async (req, res) => {
//   try {
//     const infoErrorsObj = req.flash('infoErrors');
//     const infoRegisterObj = req.flash('infoRegister');
//     const productID = req.params.id;
//     const query = { _id: productID };
//     await Product.findOne(query).then((data) => {
//       res.render('buy-one', {
//         title: 'F&D - Buy One',
//         data,
//         infoRegisterObj,
//         infoErrorsObj,
//       });
//     });
//   } catch (error) {
//     res.status(500).send({ message: error.message || 'Error Occured' });
//   }
// };

// /**
//  * POST /buyone
//  * buy one product on post
//  */
// exports.buyOneOnPost = async (req, res) => {
//   try {
//     const infoErrorsObj = req.flash('infoErrors');
//     const infoRegisterObj = req.flash('infoRegister');
//     res.render('buy-one', { title: 'F&D - Buy One', infoErrorsObj, infoRegisterObj });
//   } catch (error) {
//     res.status(500).send({ message: error.message || 'Error Occured' });
//   }
// };

// /**
//  * POST /createInvoice
//  * create Invocie
//  */
// exports.createInvoiceSingle = async (req, res) => {
//   try {
//     const productID = req.body.productID;
//     console.log(productID);
//     const query = { _id: productID };
//     var product = await Product.findOne({
//       query,
//     });
//     console.log(product);
//     // req.flash('infoSubmit', 'Invoice has been created.');
//     res.json({
//       productID,
//       product,
//     });
//   } catch (error) {
//     res.status(500).send({ message: error.message || 'Error Occured' });
//   }
// };

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
    // console.log(req.data);
    const token = req.cookies.token;
    const clientID = jwt.verify(token, 'mk');
    var user = await User.findOne({
      _id: clientID,
    });
    var client = await Client.findOne({
      email: user.email,
    }).then((data) => {
      res.render('client-info', {
        layout: './layouts/client',
        title: 'F&D - Clients Info',
        data,
        infoErrorsObj,
        infoLoginObj,
      });
    });
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
    const foods = await Product.find({ type: 'food' });
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
    const drinks = await Product.find({ type: 'drink' });
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
function arrayFilter(arr) {
  let outputArray = arr.filter(function (v, i, self) {
    return i == self.indexOf(v);
  });
  return outputArray;
}
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
    console.log(product_id);
    var userID = jwt.verify(token, 'mk');
    var user = await User.findOne({ _id: userID });
    var client = await Client.findOne({ email: user.email });
    var cart = await Cart2.findOne({ client_id: client._id });
    const count = req.body.quantity;
    // console.log(cart.product_obj);
    for (let i in cart.product_obj) {
      if (cart.product_obj[i].product_id == product_id) {
        cart.product_obj[i].count = count;
      }
    }
    await Cart2.findOneAndUpdate(
      { client_id: client._id },
      {
        product_obj: cart.product_obj,
      }
    );
    res.redirect('/cart');
  } catch (error) {
    console.log('Error add cart');
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

exports.clientPay = async (req, res) => {
  try {
    const receipt = 1;
    res.render('client-pay', { title: 'F&D - Clients Cart', receipt });
  } catch (error) {
    console.log('Error product');
    res.status(500).send({ message: error.message || 'Error Occured' });
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
