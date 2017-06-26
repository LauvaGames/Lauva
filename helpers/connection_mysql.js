"use strict";

//// INCLUDE
var mysql = require('mysql');

//// Connection MYSQL DB
var connection_mysql = undefined;

function connectBD(){
    connection_mysql = mysql.createConnection({
        host: "",
        user: "",
        password: "",
        database: ""
    });
}
connectBD();

//error
connection_mysql.on('error', function(err) {
    console.log('MYSQL BD err ' + new Date());
    setTimeout(function(){
        connectBD();
    }, 1000);

});

module.exports = connection_mysql;