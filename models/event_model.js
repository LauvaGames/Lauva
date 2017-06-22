const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    date: String,
    time: String,
    desc: String,
    coordsX: String,
    coordsY: String

}, { timestamps: true });


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
