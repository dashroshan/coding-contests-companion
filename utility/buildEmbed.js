const { EmbedBuilder } = require("discord.js");

function buildEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title.toUpperCase())
    .setTimestamp(new Date())
    .setDescription(description)
    .setColor("#1089DF");
}

module.exports = buildEmbed;
