const { EmbedBuilder } = require("discord.js");

async function embedMessage(interaction, title, description, isError = true, url, returnEmbed = false) {
    let color = (isError) ? 0xED4245 : 0x1089DF;
    let embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
    if (url) embed.setURL(url);
    if(returnEmbed) return embed;
    else await interaction.editReply({ embeds: [embed] });
}

module.exports = embedMessage;
