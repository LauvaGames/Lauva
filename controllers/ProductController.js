"use strict";
var AUTHORIZE = require('./AuthorizeController.js');
var async = require('async');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var crypto = require('crypto');
var gm = require('gm').subClass({graphicsMagick: true});
var upload = require('jquery-file-upload-middleware');

// models
const Federation = require('../models/federation_model');
const Tournament = require('../models/tournament_model');
const Event = require('../models/event_model');
const News = require('../models/news_model');
const Team = require('../models/team_model');



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
    const feder = new Federation({
        federName: req.body.federName,
        federSportType: req.body.sport,
        federDesc: req.body.federDesc,
        federCountry: req.body.country,
        federCity: req.body.city
    });

    Federation.findOne({ federName: req.body.federName }, (err, existingfeder) => {
        if (existingfeder) {
            req.flash('errors', { msg: 'Federation with that name already exists.' });
            res.end("federation exist");
        }
        feder.save((err) => {
            if(err){
                res.end('error in write to mongo');
            }else{
                Federation.find({federName: req.body.federName}, function(error, docs) {
                    if (error) {
                        console.log('error in find federation ' + error);
                    }
                    var end = '/federation/?id=' + docs[0]._id;
                    console.log(end);
                    //res.end(end);
                    res.end('/federation')
                });
            }
        })
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
                    res.end('/tournamentPage');
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