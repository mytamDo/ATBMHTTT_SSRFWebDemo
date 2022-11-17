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
          next();
        } else {
          res.json('Not permission');
        }
      })
      .catch((err) => {});
  } catch (error) {
    res.status(500).json('Sever error, token wrong');
  }
};
// Check client login
const checkClient = (req, res, next) => {
  var role = req.data.role;
  if (role == 0 || role == 2) {
    next();
  } else {
    res.json('Not permission');
  }
};
//check shipper login
const checkShipper = (req, res, next) => {
  var role = req.data.role;
  if (role >= 1) {
    next();
  } else {
    res.json('Not permission');
  }
};
//check admon login
const checkAdmin = (req, res, next) => {
  var role = req.data.role;
  if (role == 2) {
    next();
  } else {
    res.json('Not permission');
  }
};
module.exports = { checkLogin, checkClient, checkAdmin, checkShipper };
