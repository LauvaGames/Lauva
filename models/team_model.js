const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: { type: String, unique: true },
    teamSportType: String,
    teamDesc: String,
    teamCountry: String,
    teamCity: String

}, { timestamps: true });


const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
