const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const federSchema = new mongoose.Schema({
    federName: { type: String, unique: true },
    federSportType: String,
    federDesc: String,
    federCountry: String,
    federCity: String,
    federAvatar: String,
    users: Array,
    head: Array,
    tournaments: Array,
    events: Array,
    news: Array

}, { timestamps: true });


const Federation = mongoose.model('Federation', federSchema);

module.exports = Federation;
