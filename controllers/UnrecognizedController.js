"use strict";

function index(req, res){
    res.render('./pages/product/unrecognized.ejs', {});
}
module.exports.index = index;