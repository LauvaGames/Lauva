/**
 * Module Dependencies
 */
const express          = require('express');
const session          = require('express-session');
const bodyParser       = require('body-parser');
//const cookieParser     = require('cookie-parser');
const MongoStore       = require('connect-mongo')(session);
const mongoose         = require('mongoose');
const path             = require('path');
const passport         = require('passport');
const http             = require('http');
const socketio         = require('socket.io');
const compression      = require('compression');
//const logger           = require('morgan');
const errorHandler     = require('errorhandler');
const lusca            = require('lusca');
const dotenv           = require('dotenv');
const flash            = require('express-flash');
const expressValidator = require('express-validator');
const sass             = require('node-sass-middleware');
const multer           = require('multer');
const fs = require('fs');


/**
 * Load environment variables such as api keys, passwords
 */
dotenv.load({ path: '.env' });

/**
 * Controllers
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/UserController.js');
var productController = require('./controllers/ProductController.js');

/// new controller for lauva. Created 10.07.17
const mainController = require('./controllers/Main_controller.js');


/**
 * API keys and Password Configuration
 */
require('./config/passport');

/**
 * Middlewares
 */
const isAuthenticated = require('./middlewares/isAuthenticated');
const isAuthorized    = require('./middlewares/isAuthorized');

/**
 * Express Server
 */
const app = express();

/**
 * Connect to MongoDB
 */
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Connect to MySQL
 */
const mysql = require('mysql');
var mysqlConnect = require('./helpers/connection_mysql.js');
mysqlConnect.on('error', function(err) {
  console.log('MYSQL BD err ' + new Date());
  setTimeout(function(){
    mysqlConnect = require('./helpers/connection_mysql.js');
  }, 1000);
});

/**
 * Express Configuration
 */
app.use("/public", express.static(__dirname + '/public'));
app.use("/uploads", express.static(__dirname + '/uploads'));
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));

/*app.use(cookieParser());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));*/

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var csrfMiddleware = lusca.csrf();

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(function(req, res, next) {
    // Paths that start with /foo don't need CSRF
    if (/^\/addUserPhoto/.test(req.originalUrl)   || /^\/addUserAvatar/.test(req.originalUrl) || /^\//.test(req.originalUrl)|| /^\/registration/.test(req.originalUrl) || /^\/login/.test(req.originalUrl)) {
        next();
    } else {
        csrfMiddleware(req, res, next);
    }
});



app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  if(/(api)|(contact)|(^\/$)/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Routes
 */
/*app.get('/', homeController.index);
/////app.get('/login', userController.login);
/////app.post('/login', userController.doLogin);
/////app.get('/logout', isAuthenticated, userController.logout);
/////app.get('/forgot', userController.forgot);
app.post('/forgot', userController.doForgot);
app.get('/reset/:token', userController.reset);
app.post('/reset/:token', userController.doReset);
/////app.get('/register', userController.register);
/////app.post('/register', userController.doRegister);
/////app.get('/account', isAuthenticated, userController.account);
/////app.post('/account/profile', isAuthenticated, userController.updateProfile);
/////app.post('/account/password', isAuthenticated, userController.updatePassword);
app.post('/account/delete', isAuthenticated, userController.deleteAccount);
app.get('/account/unlink/:provider', isAuthenticated, userController.oauthUnlink);*/

///////////////////// from old lauva
app.get('/', isAuthenticated, userController.getMainPage);
app.post('/', isAuthenticated, function(req,res){
  res.status(303).redirect('/');
});

// new lauva created 10.07.17
app.get('/login_page', mainController.login_page);
app.get('/registration_page', mainController.registration_page);
app.post('/login', mainController.doLogin);
app.post('/registration', mainController.doRegister);
app.get('/registration_complete', mainController.registration_complete);
app.get('/password_recovery_page', mainController.password_recovery_page);
app.post('/password_recovery', mainController.password_recovery);
app.get('/password_recovery_mail', mainController.password_recovery_mail);
app.get('/change_password_page', mainController.change_password_page);
app.post('/save_new_password', mainController.save_new_password);



app.get('/authorize', userController.login);
app.get('/authorize', userController.register);

app.get('/logout', isAuthenticated, userController.logout);
app.get('/forgotPassword', isAuthenticated, userController.forgot);
app.get('/federation', isAuthenticated, userController.federationPage);
app.get('/team', isAuthenticated, userController.teamPage);
app.get('/tournament', isAuthenticated, userController.tournamentPage);
app.get('/profile', isAuthenticated, userController.getProfilePage);

app.get('/passwordRecovery', function (req, res) {
  res.render('./pages/product/passwordRecovery.ejs', {});
});
app.get('/changePassword', userController.changePassword);


//app.post('/login', userController.doLogin);
//app.post('/registration', userController.doRegister);


app.get('/getCities', function(req, res){
  userController.getCities(req , res);
});

app.post('/addUserPhoto', function(req, res){
  userController.addUserPhoto(req , res);
});
app.post('/addUserAvatar', function(req, res){
  userController.addUserAvatar(req , res);
});

app.post('/addFederationAvatar', function(req, res){
  productController.addFederationAvatar(req , res);
});
app.post('/addFederationLogo', function(req, res){
  productController.addFederationLogo(req , res);
});

app.post('/addTeamAvatar', function(req, res){
  productController.addTeamAvatar(req , res);
});
app.post('/addTeamLogo', function(req, res){
  productController.addTeamLogo(req , res);
});

app.post('/editProfile', isAuthenticated, userController.updateProfile);
app.post('/newPassword', isAuthenticated, userController.updatePassword);
app.post('/createFederation', productController.createFederetion);
app.post('/createTeam', productController.createTeam);
app.post('/createTournament', productController.createTournament);
app.post('/createEvent', productController.createEvent);
app.post('/createNews', productController.createNews);
app.post('/uploadNewsImg', function(req, res){
  productController.uploadNewsImg(req , res);
});

app.post('/tournamentScores', productController.tournamentScores);

/**
 * OAuth Authentication Routes
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
 res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
 res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
 res.redirect(req.session.returnTo || '/');
});
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
 res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler
 */
app.use(errorHandler());

/**
 * Server Initialize
 */
const server = http.Server(app);
const io     = socketio(server);

/**
 * Start Express Server with Socket.io
 */
server.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

/**
 * Socket.io Events
 */
io.on('connection', (socket) => {
  console.log("New Connection: ", socket.id);
  socket.emit('hello', { id: socket.id });
  socket.on('respond', (data) => {
    console.log("Response From", socket.id, ":", data.message);
  });
  socket.on('disconnect', () => {
    console.log('Socket', socket.id, 'disconnected!');
  });
});

module.exports = app;




