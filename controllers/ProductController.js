"use strict";
var AUTHORIZE = require('./AuthorizeController.js');
var async = require('async');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var crypto = require('crypto');
var gm = require('gm').subClass({graphicsMagick: true});
var urlp = require('url');

// models
const Federation = require('../models/federation_model');
const Tournament = require('../models/tournament_model');
const Event = require('../models/event_model');
const News = require('../models/news_model');
const Team = require('../models/team_model');
const User = require('../models/User');


function renderIndex(req, options, res){
    if(!AUTHORIZE.isLogin()) {
        response.writeHead(301,
            {Location: options.domain + 'unrecognized'}
        );
        response.end();
        return;
    }
}
module.exports.renderIndex = renderIndex;

function renderUnrecognized(req, options,res){
    res.WriteHead(200);
    res.render('./pages/product/unrecognized');
}
module.exports.renderUnrecognized = renderUnrecognized;

// create federation
exports.createFederetion = (req, res) => {

    Federation.findOne({ federName: req.body.federName }, (err, existingfeder) => {
        if (existingfeder) {
            req.flash('errors', { msg: 'Federation with that name already exists.' });
            res.end("federation exist");
            return;
        }


        const feder = new Federation({
            federName: req.body.federName,
            federSportType: req.body.sport,
            federDesc: req.body.federDesc,
            federCountry: req.body.country,
            federCity: req.body.city,
            users: req.user.id,
            head: req.user.id
        });

        feder.save((err) => {
            if(err){
                res.end('Error 1408'); //Ошибка при записи в mongo
            }else{
                Federation.find({federName: req.body.federName}, function(error, docs) {
                    if (error) {
                        console.log('error in find federation ' + error);
                        res.end('Error 1409'); //Ошибка при поиске федерации
                    } else {
                        User.findByIdAndUpdate(req.user.id, {$push: {"federations": docs[0]._id}},
                            {safe: true, upsert: true, new : true},
                            function(err) {
                                console.log(err);
                                res.end('Error 1410'); //Ошибка при записи id федерации в документ пользователя
                            }
                        );
                        res.end('/federation/?id=' + docs[0]._id);
                    }
                });
            }
        });
    });
};

exports.createTeam = (req, res) => {
    const team = new Team({
        teamName: req.body.teamName,
        teamSportType: req.body.sport,
        teamDesc: req.body.teamDesc,
        teamCountry: req.body.teamCountry,
        teamCity: req.body.teamCity
    });

    Team.findOne({ teamName: req.body.teamName }, (err, existingteam) => {
        if (existingteam) {
            req.flash('errors', { msg: 'Team with that name already exists.' });
            res.end("team exist");
        }
        team.save((err) => {
            if(err){
                res.end('error in write to mongo');
            }else{
                Team.find({teamName: req.body.teamName}, function(error, docs) {
                    if (error) {
                        console.log('error in find team ' + error);
                    }
                    var end = '/team/?id=' + docs[0]._id;
                    console.log(end);
                    //res.end(end);
                    res.end('/team')
                });
            }
        })
    });
};

/// Tournament
exports.createTournament = (req, res) => {
    const tournament = new Tournament({
        name: req.body.name,
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
        desc: req.body.desc,
        coordsX: req.body.coordsX,
        coordsY: req.body.coordsY
    });
    Tournament.findOne({ name: req.body.name }, (err, existingTournament) => {
        if (existingTournament) {
            req.flash('errors', { msg: 'Tournament with that name already exists.' });
            res.end("tournament exist");
        } else {
            tournament.save((err) => {
                if(err){
                    res.end('error in write to mongo');
                    console.log('error in write to mongo: ' + err)
                }else{
                    Tournament.find({name: req.body.name}, function(error, docs) {
                        if (error) {
                            console.log('error in find team ' + error);
                        }
                        var end = '/tournament/?id=' + docs[0]._id;
                        console.log(end);
                        //res.end(end);
                        res.end('/team')
                    });
                }
            })
        }
    });
};

// create Event
exports.createEvent = (req, res) => {
    const event = new Event({
        name: req.body.name,
        date: req.body.date,
        time: req.body.time,
        desc: req.body.desc,
        coordsX: req.body.coordsX,
        coordsY: req.body.coordsY
    });
    Event.findOne({ name: req.body.name }, (err, existingEvent) => {
        if (existingEvent) {
            req.flash('errors', { msg: 'Event with that name already exists.' });
            res.end("event exist");
        } else {
            event.save((err) => {
                if(err){
                    res.end('error in write to mongo');
                    console.log('error in write to mongo: ' + err)
                }else{
                    res.end('/eventPage');
                }
            })
        }
    });
};

// create News
exports.createNews = (req, res) => {
    const news = new News({
        title: req.body.title,
        subtitle: req.body.subtitle,
        video: req.body.video,
        text: req.body.text,
        photos: req.body.photos
    });
    News.findOne({ title: req.body.title }, (err, existingEvent) => {
        /*if (existingEvent) {
            req.flash('errors', { msg: 'Event with that name already exists.' });
            res.end("event exist");
        } else {*/
            news.save((err) => {
                if(err){
                    res.end('error in write to mongo');
                    console.log('error in write to mongo: ' + err)
                }else{
                    res.end('/newsPage');
                }
            });
        //}
    });
};

exports.tournamentScores = (req, res) => {
    console.log(req.body);

    Tournament.update({ name: 'first' }, { $set: { teams: req.body.teams , scores: req.body.results }}, function(err, test) {
        if (err) {
            console.log('Error:' + err );
            res.end('error in write to mongo');
        } else {
            res.end('scores writen');
        }
    });
};


function addTeamLogo(req, res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/team_photo');
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
        res.end('uploads/team_photo/'+crypt + Exten);
    });
    form.parse(req);
}
module.exports.addTeamLogo = addTeamLogo;

function addTeamAvatar(req, res){
    var x1 = req.body.x1;
    var y1 = req.body.y1;
    var width = req.body.width1;
    var height = req.body.height1;
    var adress = req.body.adress;
    var name = adress.substring(19);

    // размеры дива с изображением на клиенте
    var h = req.body.h;
    var w = req.body.w;

    gm('/nodejs/newLauva/uploads/team_photo/' + name).size(function (err, size) {
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
        gm('/nodejs/newLauva/uploads/team_photo/' + name).crop(newwidth, newheight, newX, newY).write('/nodejs/newLauva/uploads/team_avatar/' + name, function (err) {
            if (err) console.log(err);
            res.end('/uploads/team_avatar/' + name);
        });

    });
}
module.exports.addTeamAvatar = addTeamAvatar;

function addFederationLogo(req, res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/feder_logo');
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
        res.end('uploads/feder_logo/'+crypt + Exten);
    });
    form.parse(req);
}
module.exports.addFederationLogo = addFederationLogo;

function addFederationAvatar(req, res){
    var x1 = req.body.x1;
    var y1 = req.body.y1;
    var width = req.body.width1;
    var height = req.body.height1;
    var adress = req.body.adress;
    var name = adress.substring(19);
    // размеры дива с изображением на клиенте
    var h = req.body.h;
    var w = req.body.w;
    gm('/nodejs/newLauva/uploads/feder_logo/' + name).size(function (err, size) {
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
        gm('/nodejs/newLauva/uploads/feder_logo/' + name).crop(newwidth, newheight, newX, newY).write('/nodejs/newLauva/uploads/feder_avatar/' + name, function (err) {
            if (err) console.log(err);
            res.end('/uploads/feder_avatar/' + name);

            var query = urlp.parse(req.url).query,
                params = qs.parse(query);
            var id = params.id;
            Federation.findByIdAndUpdate(id, { $set: { federAvatar: '/uploads/feder_avatar/' + name }}, { new: true }, function (err) {
                if (err) return handleError(err);
            });
        });
    });
}
module.exports.addFederationAvatar = addFederationAvatar;

function uploadNewsImg(req, res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/news_photo');
    var Exten;
    var crypt;
    var array = [];
    form.on('file', function(field, file) {
        Exten = "" + path.extname(file.name);
        crypt = crypto.createHash('md5').update('' + Math.random() + Date.now() + file.name).digest('hex');
        fs.rename(file.path, path.join(form.uploadDir, crypt+Exten), function(err){
            if (err) console.log('error in rename file' + err)
        });
        var pushed = array.push('uploads/news_photo/'+crypt + Exten);
    });
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    form.on('end', function() {
        res.end(array.toString());
    });
    form.parse(req);
}
module.exports.uploadNewsImg = uploadNewsImg;