const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    video: String,
    text: String,
    photos: Array

}, { timestamps: true });


const News = mongoose.model('News', newsSchema);

module.exports = News;
