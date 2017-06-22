var mysql = require('mysql');
var connectMysql = require('../helpers/connection_mysql.js');

function getCountry(callback){
    connectMysql.query("SELECT `country_id`, `name` FROM `countries`", function(err, rows){
        if(err){
            console.log("err mysql in function getCountry" + err);
        }
        callback(null, rows);
    });
}
module.exports.getCountry = getCountry;

function get2lettersCountry(callback){
    connectMysql.query("SELECT `id`, `value` FROM `LL_countries`", function(err, rows){
        if(err){
            console.log("err mysql in function get2lettersCountry" + err);
        }
        callback(null, rows);
    });
}
module.exports.get2lettersCountry = get2lettersCountry;

function getSportType(callback){
    connectMysql.query("SELECT `value` FROM `LL_sport` ORDER BY value", function(err, rows){
        if(err){
            console.log("err mysql in function getSportType" + err);
        }
        callback(null, rows);
    });
}
module.exports.getSportType = getSportType;


function getCitiesMysql(callback, country_id){
    connectMysql.query("SELECT DISTINCT  `city` FROM `cities` WHERE `country_id` = '"+country_id+"' AND `biggest_city` = 1 ORDER BY city" , function(err, rows){
        if(err){
            console.log("err mysql in function getCountry" + err);
        }
        callback(null, rows);
    });
}
module.exports.getCitiesMysql = getCitiesMysql;

function getLanguage(callback){
    connectMysql.query("SELECT `language` FROM `LL_languages` ORDER BY language" , function(err, rows){
        if(err){
            console.log("err mysql in function getCountry" + err);
        }
        callback(null, rows);
    });
}
module.exports.getLanguage = getLanguage;

function getCityInRus(callback, cityEN){
    connectMysql.query("SELECT `value` FROM `LL_citiesInEnglish` WHERE `id` = '"+cityEN+"'" , function(err, rows){
        if(err){
            console.log("err mysql in function getCountry" + err);
        }
        callback(null, rows);
    });
}
module.exports.getCityInRus = getCityInRus;