const mongoose = require("mongoose");

module.exports = mongoose.model("problemChannel", new mongoose.Schema({
    channel: { type: String },
    server: { type: String }
}));