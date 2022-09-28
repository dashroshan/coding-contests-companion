const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// invite command to receive the bot invitation link
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite the bot to another server'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Create an embed with the link and send it
        const embed = new EmbedBuilder()
            .setColor(0x1089DF)
            .setTitle('INVITE BOT')
            .setDescription('Open the following link, select the server where you want to invite this bot, keep all permissions checked, click authorize. **[Bot invitation link.](https://discord.com/api/oauth2/authorize?client_id=1023627528860086332&permissions=268435456&scope=bot%20applications.commands)**');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    },
};