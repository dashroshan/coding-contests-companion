const mongoose = require("mongoose");

module.exports = mongoose.model("channel", new mongoose.Schema({
    channel: { type: String },
    server: { type: String },
    roleToPing: { type: String },
}));