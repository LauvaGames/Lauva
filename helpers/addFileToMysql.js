"use strict";
var fs = require('fs');
var mysql = require('mysql');
var connectMysql = require('../helpers/connection_mysql.js');

function addToMysql () {
    var sport = fs.readFileSync('uploads/sport2.txt').toString().split("\n");
    for(var i in sport) {
        //console.log(sport[i]);
        var name = sport[i];
        connectMysql.query("INSERT INTO `LL_sport`(`value`) VALUES ('"+name+"')", function(err, rows){
            if(err){
                console.log("err mysql in function addToMysql" + err);
            }
        });
    }
}
module.exports.addToMysql = addToMysql;