const mongoose = require("mongoose");

module.exports = mongoose.model("contestChannel", new mongoose.Schema({
    channel: { type: String },
    server: { type: String },
    roleToPing: { type: String },
}));