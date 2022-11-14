const { reset } = require('nodemon');
require('../models/database');
const User = require('../models/User');
const Role = require('../models/Role')

/**
 * GET /
 * Homepage
 */
exports.homepage = async(req, res) => {
    try{
        const users = await User.find({})
        res.render('index', {title: 'F&D - Homepage', users})
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"})
    }
}

/**
 * GET /login
 * login
 */
exports.login = async(req, res) => {
  try{
      res.render('login', {title: 'F&D - Login'})
  }catch(error){
      res.status(500).send({message: error.message || "Error Occured"})
  }
}
/**
 * POST
 * login on post
 */
exports.loginOnPost =  async(req, res) =>{
  try {
    var email = req.body.email;
    var pass = req.body.password;
    var user = await User.findOne({
      _email: email, 
      _pass: pass
    });
    console.log(user);
    res.json(user);

  } catch (error) {
    res.redirect('/login');
  }
}

/**
 * GET /register
 * register
 */
exports.register = async(req, res) =>{
  try{
      res.render('register'), {title: 'F&D - Register'}
  }catch(error){
      res.status(500).send({message: error.message || "Error Occured"})
  }
}

async function insertDymmyUserData(){
    try {
      await User.insertMany([
          { 
            email: "ttphong071016@gmail.com",
            pass: "123123",
            role: "ADM"
          }
      ]);
    } catch (error) {
      console.log('err', + error)
    }
  }

async function insertDymmyRoleData(){
  try {
    await Role.insertMany([
        { 
          role: "ADM"
        },
        {
          role: "SHI"
        },
        {
          role: "USR"
        }
    ]);
  } catch (error) {
    console.log('err', + error)
  }
}


// insertDymmyUserData();
// insertDymmyRoleData();