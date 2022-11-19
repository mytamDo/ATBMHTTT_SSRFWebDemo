const { reset } = require('nodemon');
const jwt = require('jsonwebtoken');
require('../models/database');
const User = require('../models/User');
const Role = require('../models/Role');
const Client = require('../models/Client');

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const users = await User.find({});
    res.render('index', { title: 'F&D - Homepage', users });
  } catch (error) {
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
 * POST
 * login on post
 */

exports.loginOnPost = async (req, res) => {
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
          req.flash('infoLogin', 'Login Success');
          console.log('OK');
          res.redirect('/login');
        }
      })
      .catch((err) => {
        req.flash('infoErrors', 'Something wrong');
        console.log('Error, something wrong');
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
    User.findOne({
      email: email,
    }).then((data) => {
      if (data) {
        req.flash('infoErrors', 'Register failed, Email existed');
        res.redirect('/register');
        console.log('Loi');
      } else {
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
        });
        req.flash('infoRegister', 'Register Success');
        console.log('OK');
        res.redirect('/register');
      }
    });
  } catch (error) {
    req.flash('infoErrors', 'Register failed');
    res.redirect('/register');
    console.log('Sever Error');
  }
};

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
exports.clients = async (req, res) => {
  try {
    console.log(req.data);
    res.render('index', { layout: './layouts/client', title: 'F&D - Clients' });
  } catch (error) {
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
