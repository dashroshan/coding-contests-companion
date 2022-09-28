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
        respStr += "**[\[For everyone\] View All Contests](http://a.com)**\n";
        respStr += "Use the `/contests` command. Select any contest platform using the selection box present below the message sent by the bot, to view all its ongoing and upcoming contests.\n\n"
        respStr += "**[\[For admin\] Setup Notifications](http://a.com)**\n";
        respStr += "Use the `/notifications-setup` command. Select the role it should ping, and the channel where it should send the notifications. Make sure the bot has permission to send messages in the selected channel, and that the selected role is present below the bot role in your server roles settings. The bot would now create an embed with a button for your members to opt-in and out-out of the notifications, and start notifying about all upcoming contests.\n\n";
        respStr += "**[\[For admin\] Stop Notifications](http://a.com)**\n";
        respStr += "Use the `/notifications-stop` command. The bot would then stop notifying your server about upcoming contests. Optional: delete the notifications role, and the role managing embed which was generated using the command above.\n\n";
        respStr += "Need more help? **[Join the support server](https://discord.gg/9sDtq74DMn)**"

        // Create and send the embed
        const embed = new EmbedBuilder()
            .setColor(0x1089DF)
            .setTitle('USER GUIDE')
            .setDescription(respStr);
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    },
};