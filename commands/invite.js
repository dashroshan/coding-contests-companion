const embedMessage = require('../utility/embed message');
const { SlashCommandBuilder} = require('discord.js');

// invite command to receive the bot invitation link
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite the bot to another server'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        await embedMessage(interaction, 'INVITE THE BOT', 'Open the above link, select the server where you want to invite this bot, keep all permissions checked, and click authorize. Use the **/help** command for setup instructions once the bot joins your server.', false, 'https://discord.com/api/oauth2/authorize?client_id=1023627528860086332&permissions=268435456&scope=bot%20applications.commands');
    },
};