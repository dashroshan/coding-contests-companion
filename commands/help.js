const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// help command for the user guide
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('User guide on how to use the bot'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // User guide data for the embed body
        respStr = "";
        respStr += "**FOR EVERYONE**\n";
        respStr += "**[View All Contests](http://a.com)**\n";
        respStr += "Use the `/contests` command. Select any contest platform using the selection box present below the message sent by the bot, to view all its ongoing and upcoming contests.\n\n";
        respStr += "**FOR ADMIN ONLY**\n";
        respStr += "**[Setup Contest Notifications](http://a.com)**\n";
        respStr += "Use the `/setup-contest` command. Select the role it should ping, and the channel where it should send the notifications. Make sure the bot has permission to send messages in the selected channel, and that the selected role is present below the bot role in your server roles settings. The bot would now create an embed with a button for your members to opt-in and out-out of the notifications, and start notifying about all upcoming contests.\n\n";
        respStr += "**[Setup Problem Of The Day](http://a.com)**\n";
        respStr += "Use the `/setup-problem` command and select the channel where it should send the daily problems. Make sure the bot has permission to send messages in the selected channel. The bot would now start sending a problem every day.\n\n";
        respStr += "**[Stop Running Services](http://a.com)**\n";
        respStr += "Use the `/stop` command and select the feature service that you want to stop for your server. Optional: for the contest notifications, you may also want to delete the role it used to ping, and the role managing embed.\n\n";
        respStr += "Need more help? **[Join the support server](https://discord.gg/9sDtq74DMn)**"

        // Create and send the embed
        const embed = new EmbedBuilder()
            .setColor(0x1089DF)
            .setTitle('HOW TO USE THE BOT')
            .setURL('https://github.com/roshan1337d/coding-contests-companion')
            .setDescription(respStr);
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    },
};