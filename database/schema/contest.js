const mongoose = require("mongoose");

module.exports = mongoose.model("contest", new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    platform: { type: String },
    start: { type: Number },
    end: { type: Number },
    duration: { type: Number },
    notified: { type: Boolean, default: false }
}));