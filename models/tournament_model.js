const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    type: String,
    date: String,
    time: String,
    desc: String,
    coordsX: String,
    coordsY: String,
    teams: Array,
    scores: Array

}, { timestamps: true });


const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
