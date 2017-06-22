const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const federSchema = new mongoose.Schema({
    federName: { type: String, unique: true },
    federSportType: String,
    federDesc: String,
    federCountry: String,
    federCity: String

}, { timestamps: true });


const Federation = mongoose.model('Federation', federSchema);

module.exports = Federation;
