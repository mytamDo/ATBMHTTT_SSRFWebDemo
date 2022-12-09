// // // Used to check login // // //

const jwt = require('jsonwebtoken');
const { findOne } = require('../models/Invoice');
const User = require('../models/User');

const checkLogin = (req, res, next) => {
  try {
    var token = req.cookies.token;
    var userID = jwt.verify(token, 'mk');

    User.findOne({ _id: userID })
      .then((data) => {
        if (data) {
          req.data = data;
          console.log('login ok');
          next();
        } else {
          return res.redirect('/must-login');
        }
      })
      .catch((err) => {
        return 'err', err;
      });
  } catch (error) {
    return res.redirect('/must-login');
  }
};
// Check client login
const checkClient = (req, res, next) => {
  var role = req.data.role;
  if (role == 0 || role == 2) {
    console.log('client ok');
    next();
  } else {
    return res.redirect('/must-login');
  }
};
//check shipper login
const checkShipper = (req, res, next) => {
  var role = req.data.role;
  if (role >= 1) {
    console.log('shipper ok');
    next();
  } else {
    return res.redirect('/must-login');
  }
};
//check admin login
const checkAdmin = (req, res, next) => {
  var role = req.data.role;
  if (role == 2) {
    console.log('admin ok');
    next();
  } else {
    return res.redirect('/must-login');
  }
};
module.exports = { checkLogin, checkClient, checkAdmin, checkShipper };
