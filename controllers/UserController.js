"use strict";
var geoip = require('geoip-lite');
var async = require('async');
var profile = require('../models/profile_model.js');
var countries = require('../helpers/countries.js');
var urlp = require('url');
var qs = require('query-string');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var crypto = require('crypto');
var gm = require('gm').subClass({graphicsMagick: true});
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Federation = require('../models/federation_model');
const Tournament = require('../models/tournament_model');

/**
 * GET /getProfilePage
 */
exports.getProfilePage = (req, res) => {
    //if (req.isAuthenticated()) {
        var ip = req.connection.remoteAddress.substring(7);
        var geo = geoip.lookup(ip);
        var twoLetters = geo.country; //UA
        async.parallel([
            function(callback){
                profile.getCountry(callback)
            },
            function(callback){
                profile.getSportType(callback)
            },
            function(callback){
                profile.get2lettersCountry(callback)
            },
            function(callback){
                profile.getLanguage(callback)
            }
        ], function(err, results) {
            var country= "";
            for(var i=0; i<results[2].length; i++ ) {
                if(twoLetters == results[2][i].id){
                    country = results[2][i].value
                }
            }
            User.findById(req.user.id, (err, user) => {
                var sportArr = user.profile.sport.split(',');
                var langArr = user.profile.lang.split(',');
                if (err) { console.log('error in main page' + err); return next(err); }
                res.render('../views/pages/product/editProfile.ejs', {"countries": results[0], "sport":results[1], "c":country, "lang":results[3], "user":user, "usersport":sportArr, "userlang":langArr});
            });
        });
    /*}
    res.redirect('/authorize');*/
};

exports.getMainPage = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var ip = req.connection.remoteAddress.substring(7);
    var geo = geoip.lookup(ip);
    var twoLetters = geo.country; //UA

    async.parallel([
        function(callback){
            profile.getCountry(callback)
        },
        function(callback){
            profile.getSportType(callback)
        },
        function(callback){
            profile.get2lettersCountry(callback)
        }
    ], function(err, results) {
        var country= "";
        for(var i=0; i<results[2].length; i++ ) {
            if(twoLetters == results[2][i].id){
                country = results[2][i].value
            }
        }
        User.findById(req.user.id, (err, user) => {
            if (err) { console.log('error in main page' + err); return next(err); }
            res.render('../views/pages/product/main.ejs', {"countries": results[0], "sport":results[1], "c":country, "user":user});
        });
        //res.render('../views/pages/product/main.ejs', {"countries": results[0], "sport":results[1], "c":country});
    });
};

function getCities(req, res){
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var country_id = params.country_id;

    var ip = req.connection.remoteAddress.substring(7);
    var geo = geoip.lookup(ip);
    var cityEN = geo.city;

    async.parallel([
        function(callback){
            profile.getCitiesMysql(callback, country_id)
        },
        function(callback){
            profile.getCityInRus(callback, cityEN)
        }
    ], function(err, results) {

        var city = '';
        if(results[1][0].value == undefined) {
            var city = "Киев"; 
        }else {
            var city = results[1][0].value;
        }

        results[0].push({'mycity': city})
        res.end(JSON.stringify(results[0]));
    });
}
module.exports.getCities = getCities;

// сохраняем фото пользователя
function addUserPhoto(req, res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/user_photo');
    var Exten;
    var crypt;
    form.on('file', function(field, file) {

        Exten = "" + path.extname(file.name);
        crypt = crypto.createHash('md5').update('' + Math.random() + Date.now() + file.name).digest('hex');
        fs.rename(file.path, path.join(form.uploadDir, crypt+Exten), function(err){
            if (err) console.log('error in rename file' + err)
        });
    });
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    form.on('end', function() {
        if (Exten == '.jpg' || Exten == '.png' || Exten == '.gif' || Exten == '.jpeg') {
            res.end('uploads/user_photo/'+crypt + Exten);
            console.log('uploads/user_photo/'+crypt + Exten);
        } else {
            res.end('exten not valid');
            console.log('exten not valid:' + Exten);
        }
    });
    form.parse(req);
}
module.exports.addUserPhoto = addUserPhoto;

// обрезаем фото пользователя
function addUserAvatar(req, res){
    var x1 = req.body.x1;
    var y1 = req.body.y1;
    var width = req.body.width1;
    var height = req.body.height1;
    var adress = req.body.adress;
    var name = adress.substring(19);
    var adress2 = '/nodejs/newLauva/uploads/user_photo/' + name;

    // размеры дива с изображением на клиенте
    var h = req.body.h;
    var w = req.body.w;

    // размеры оригинала изображения

    gm('/nodejs/newLauva/uploads/user_photo/' + name).size(function (err, size) {
            if (!err) {
                var w_nat = size.width;
                var h_nat = size.height;
                var newwidth = width * (w_nat/w);
                var newX = x1*(w_nat/w);
                var newheight = height * (h_nat/h);
                var newY = y1*(h_nat/h);
            }
            else {
                console.log(err);
            }
            gm('/nodejs/newLauva/uploads/user_photo/' + name).crop(newwidth, newheight, newX, newY).write('/nodejs/newLauva/uploads/user_avatar/' + name, function (err) {
                if (err) console.log(err);
                res.end('/uploads/user_avatar/' + name);
            });

        });
}
module.exports.addUserAvatar = addUserAvatar;



///////////////////
///***user.js***///
///////////////////


/**
 * GET /login
 * Login page.
 */
exports.login = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('pages/product/authorize.ejs', {
        title: 'Authorize'
    });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.doLogin = (req, res, next) => {
    /*req.assert('email', 'Email is not valid').isEmail();
     req.assert('password', 'Password cannot be blank').notEmpty();
     req.sanitize('email').normalizeEmail({ remove_dots: false });*/

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/authorize');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash('errors', info);
            return res.redirect('/authorize');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            req.flash('success', { msg: 'Success! You are logged in.' });
            //res.statusCode = 303;
            //res.redirect(req.session.returnTo || '/');
            res.end("redirect")
        });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    //return res.redirect('/');
    res.end('logout')
};

/**
 * GET /signup
 * Signup page.
 */
exports.register = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('pages/product/authorize.ejs', {
        title: 'Create Account'
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.doRegister = (req, res, next) => {

    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        console.log("errors" + JSON.stringify(errors));
        req.flash('errors', errors);
        return res.redirect('/authorize');
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            console.log("user exist");
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/authorize');
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.end("redirect");
                //return res.status(303).redirect("/");
            });



        })

    });


};

/**
 * GET /account
 * Profile page.
 */
exports.account = (req, res) => {
    res.render('user/profile', {
        title: 'Account Management'
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.updateProfile = (req, res, next) => {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        //return res.redirect('/profile');
        res.end('error in update profile');
    }

    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.email = req.body.email || '';
        user.username = req.body.username || '';
        user.profile.lastName = req.body.lastName || '';
        user.profile.firstName = req.body.firstName || '';
        user.profile.phone = req.body.phone || '';
        user.profile.country = req.body.country || '';
        user.profile.city = req.body.city || '';
        user.profile.lang = req.body.lang || '';
        user.profile.sport = req.body.sport || '';
        user.profile.work = req.body.work || '';
        user.profile.skype = req.body.skype || '';
        user.profile.insta = req.body.insta || '';
        user.profile.avatar = req.body.avatar || '';
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                    //return res.redirect('/account');
                    res.end('error in update profile');
                }
                return next(err);
            }
            req.flash('success', { msg: 'Profile information has been updated.' });
            //res.redirect('/account');
            res.end('redirect');
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.updatePassword = (req, res, next) => {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        //return res.redirect('/account');
        res.end('error in update password')
    }

    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.password = req.body.password;
        user.save((err) => {
            if (err) { return next(err); }
            req.flash('success', { msg: 'Password has been changed.' });
            //res.redirect('/account');
            res.end('redirect')
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.deleteAccount = (req, res, next) => {
    User.remove({ _id: req.user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        req.flash('info', { msg: 'Your account has been deleted.' });
        res.redirect('/');
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.oauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user[provider] = undefined;
        user.tokens = user.tokens.filter(token => token.kind !== provider);
        user.save((err) => {
            if (err) { return next(err); }
            req.flash('info', { msg: `${provider} account has been unlinked.` });
            res.redirect('/account');
        });
    });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.reset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
            if (err) { return next(err); }
            if (!user) {
                req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                return res.redirect('/forgot');
            }
            res.render('user/reset', {
                title: 'Password Reset'
            });
        });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.doReset = (req, res, next) => {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }

    async.waterfall([
        function (done) {
            User
                .findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec((err, user) => {
                    if (err) { return next(err); }
                    if (!user) {
                        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                        return res.redirect('back');
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save((err) => {
                        if (err) { return next(err); }
                        req.logIn(user, (err) => {
                            done(err, user);
                        });
                    });
                });
        },
        function (user, done) {
            const transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Your Hackathon Starter password has been changed',
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('success', { msg: 'Success! Your password has been changed.' });
                done(err);
            });
        }
    ], (err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
};

/**
 * GET /federationPage
 * federationPage render.
 */
exports.federationPage = (req, res) => {
    if (req.isAuthenticated()) {
        /*var query = urlp.parse(req.url).query,
            params = qs.parse(query);
        var id = params.id;
        console.log('feder id: ' + id);
        Federation.findById(id, (err, federation) => {
            if (err) { console.log('error in federation page' + err); return next(err); }
            res.render('../views/pages/product/federation.ejs', {"federation":federation});
        });*/
        res.render('./pages/product/federation.ejs');
    }
};

/**
 * GET /teamPage
 * teamPage render.
 */
exports.teamPage = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('./pages/product/teamPage.ejs');
    }
};   

/**
 * GET /tournament
 * tournamentPage render.
 */
exports.tournamentPage = (req, res) => {
    if (req.isAuthenticated()) {
        /*User.findById(req.user.id, (err, user) => {
         if (err) { console.log('error in feder page' + err); return next(err); }
         res.render('../views/pages/product/federationPage.ejs', {"user":user});
         });*/
        res.render('./pages/product/tournamentPage.ejs');
    }
    //res.redirect('/authorize');
};


/**
 * GET /passwordRecovery
 * passwordRecovery render.
 */
exports.changePassword = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('./pages/product/changePassword.ejs');
    }
    res.redirect('/authorize');
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.forgot = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('./pages/product/forgotPassword.ejs', {
        title: 'Forgot Password'
    });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.doForgot = (req, res, next) => {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }

    async.waterfall([
        function (done) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash('errors', { msg: 'Account with that email address does not exist.' });
                    return res.redirect('/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            const transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Reset your password on Hackathon Starter',
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
                done(err);
            });
        }
    ], (err) => {
        if (err) { return next(err); }
        res.redirect('/forgot');
    });
};