const express = require('express');
const expressLayouts = require('express-ejs-layouts');
// const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser());
app.use(
  session({
    secret: 'fdshop',
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
// app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//Landing page
const routes = require('./server/routes/fdRoutes.js');
app.use('/', routes);

app.listen(port, () => console.log(`Listening to port ${port}`));

// body parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
