const embedMessage = require("../utility/embed message");
const { SlashCommandBuilder } = require("discord.js");

// help command for the user guide
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("User guide on how to use the bot"),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        respStr = `**FOR EVERYONE**
**[View All Contests](http://ignore-the-link.com)**
Use the \`/contests\` command. Select any contest platform using the selection box present below the message sent by the bot, to view all its ongoing and upcoming contests.

**FOR ADMIN ONLY**
**[Setup Contest Notifications](http://ignore-the-link.com)**
Use the \`/setup-contest\` command. Select the role it should ping, and the channel where it should send the notifications. Make sure the bot has permission to send messages in the selected channel, and that the selected role is present below the bot role in your server roles settings. The bot would now create an embed with a button for your members to opt-in and out-out of the notifications, and start notifying about all upcoming contests.

**[Setup Problem Of The Day](http://ignore-the-link.com)**
Use the \`/setup-problem\` command and select the channel where it should send the daily problems. Make sure the bot has permission to send messages in the selected channel. The bot would now start sending a problem every day.

**[Stop Running Services](http://ignore-the-link.com)**
Use the \`/stop\` command and select the feature service that you want to stop for your server. Optional: for the contest notifications, you may also want to delete the role it used to ping, and the role managing embed.

Need more help? **[Join the support server](https://discord.gg/9sDtq74DMn)**`;

        await embedMessage(
            interaction,
            "HOW TO USE THE BOT",
            respStr,
            false,
            "https://github.com/roshan1337d/coding-contests-companion"
        );
    },
};
