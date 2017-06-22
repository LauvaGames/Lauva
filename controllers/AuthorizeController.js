"use strict";
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'NotCleanedKiwi';



function register(req, res, mysql){

    //var permission = encrypt('user_id'); // + id
    let userName = req.body.userName;
    let email = req.body.userName;
    let phone = req.body.phone;
    ///mysql.query("INSERT INTO ``"

    //);


    //res.cookie('LL_user', '', { expires: new Date(Date.now() + 1000*60*60*24*7)});
    //res.cookie('LL_auth', '', { expires: new Date(Date.now() + 1000*60*60*24*7)});
}
module.exports.register = register;

function login(user){

}
module.exports.login = login;

function isLogin(){
    return;
}
module.exports.isLogin = isLogin;

function checkPermissions(user){
     return; // true || false
}
module.exports.checkPermisions = checkPermissions;

function changePermissions(){

}
module.exports.changePermissions = changePermissions;

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}