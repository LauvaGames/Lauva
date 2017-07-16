"use strict";
var geoip       = require('geoip-lite');
var async       = require('async');
var profile     = require('../models/profile_model.js');
var countries   = require('../helpers/countries.js');
var urlp        = require('url');
var qs          = require('query-string');
var fs          = require('fs');
var path        = require('path');
var formidable  = require('formidable');
var crypto      = require('crypto');
var gm          = require('gm').subClass({graphicsMagick: true});
const nodemailer = require('nodemailer');
const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose  = require('mongoose');
var ejs         = require("ejs");
//models
const User = require('../models/User');
const Federation = require('../models/federation_model');



// render login page, if user not authorized
exports.login_page = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('./pages/new_views/login_page.ejs');
};

exports.doLogin = (req, res, next) => {

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login_page');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash('errors', info);
            return res.redirect('/login_page');
        }
        req.logIn(user, (error) => {
            if (error) { return next(error); }
            req.flash('success', { msg: 'Success! You are logged in.' });
            //res.statusCode = 303;
            //res.redirect(req.session.returnTo || '/');
            res.end("redirect");
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    //return res.redirect('/');
    res.end('logout')
};





exports.registration_page = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('./pages/new_views/registration_page.ejs');
};

exports.doRegister = (req, res, next) => {

    /*req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ remove_dots: false });*/

    const errors = req.validationErrors();

    if (errors) {
        console.log("errors" + JSON.stringify(errors));
        req.flash('errors', errors);
        return res.redirect('/login_page');
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        profile: {
            lastName: req.body.surname,
            firstName: req.body.name
        }
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            console.log("user exist");
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            //return res.redirect('/registration_page');
            res.end('user exist');
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'lauvagames@gmail.com',
                        pass: 'Lauva1408'
                    }
                });
                var email = req.body.email;
                var link = 'http://95.46.99.158:4000/registration_complete/?email=' + user.email + '&password=' + user.password;

                ejs.renderFile(__dirname + "/registration_template_mail.ejs", { user: user, link: link}, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var mainOptions = {
                            from: 'lauvagames@gmail.com', // sender address
                            to: email, // list of receivers
                            subject: 'Password recovery',
                            html: data
                        };
                        //console.log("html data ======================>", mainOptions.html);
                        transporter.sendMail(mainOptions, function (err, info) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.end('mail send');
                            }
                        });
                    }
                });
            });
        })
    });
};

exports.registration_complete = (req, res, next) => {
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var email = params.email;
    var password = params.password;

    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email.toLowerCase() }, (err, user) => {
                if (!user) {
                    return done(null, false, { msg: `Email ${email} not found.` });
                }
                if (password == user.password) {
                    return done(null, user);
                } else {
                    return done(null, false, { msg: 'Invalid email or password.' });
                }
            });
        })
    );

    passport.authenticate ('local', (err, user, info) => {
        if (err) { console.log("ERROR: "+ err);  return next(err); }
        if (!user) {
            req.flash('errors', info);
            console.log('Error: !user' + JSON.stringify(info));
            return res.redirect('/login_page');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }

            req.flash('info', 'Flash Message Added');
            res.redirect(301, '/');
            //res.redirect(301, '/change_password_page/?id='+user.id);
        });
    })(req, res, next);
};


exports.password_recovery_page = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('./pages/new_views/password_recovery_page.ejs');
};


exports.password_recovery = (req, res, next) => {

    var email = req.body.email;

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lauvagames@gmail.com',
                    pass: 'Lauva1408'
                }
            });

            var link = 'http://95.46.99.158:4000/password_recovery_mail/?email=' + email + '&password=' + user.password;

            ejs.renderFile(__dirname + "/recovery_template_mail.ejs", { user: user, link: link}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var mainOptions = {
                        from: 'lauvagames@gmail.com', // sender address
                        to: email, // list of receivers
                        subject: 'Password recovery',
                        html: data
                    };
                    //console.log("html data ======================>", mainOptions.html);
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.end('mail send');
                        }
                    });
                }
            });

            /*let mailOptions = {
                from: 'lauvagames@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Password recovery',
                text: 'This mail can recover your pass. Click the link', // plain text body
                html: '<a href=' + link +'>Password recovery</a>'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                //console.log('Message is sent: %s', info.messageId, info.response);
            });*/
        } else {
            console.log('that user not exist');
            res.end('user not exist');
        }
    });
};

exports.change_password_page = (req, res) => {
    /*if (req.user) {
     return res.redirect('/');
     }*/
    res.render('./pages/new_views/change_password_page.ejs', {title: 'change_password'});
};

exports.password_recovery_mail = (req, res, next) => {
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var email = params.email;
    var password = params.password;

    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }
            if (password == user.password) {
                return done(null, user);
            } else {
                return done(null, false, { msg: 'Invalid email or password.' });
            }
        });
    })
    );

    passport.authenticate ('local', (err, user, info) => {
        if (err) { console.log("ERROR: "+ err);  return next(err); }
        if (!user) {
            req.flash('errors', info);
            console.log('Error: !user' + JSON.stringify(info));
            return res.redirect('/login_page');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }

            req.flash('info', 'Flash Message Added');
            //req.flash('info', user.id);
            res.redirect(301, '/change_password_page');
            //res.redirect(301, '/change_password_page/?id='+user.id);

        });
    })(req, res, next);
};

exports.save_new_password = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) { console.log('error in save password'); return next(err); }
        user.password = req.body.password;
        user.save((err) => {
            if (err) { return next(err); }
            req.flash('success', { msg: 'Password has been changed.' });
            //res.redirect('/account');
            res.end('redirect')
        });
    });
};