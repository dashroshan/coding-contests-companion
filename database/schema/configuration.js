const mongoose = require("mongoose");

module.exports = mongoose.model("configuration", new mongoose.Schema({
    name: { type: String, default: 'config' },
    lastDailyProblem: { type: Number },
}));