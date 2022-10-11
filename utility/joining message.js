const embedMessage = require('./embed message');
const { PermissionFlagsBits } = require('discord.js');

async function joiningMessage(guild) {
    try {
        let channelToSend;
        guild.channels.cache.forEach(channel => {
            const hasPermission = channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages);
            if (channel.type === 0 && !channelToSend && hasPermission) channelToSend = channel;
        });

        // Return if no channel with send messages permission found
        if (!channelToSend) return;

        // Create and send the embed
        const embed = await embedMessage(null, `Hello ${guild.name}`, "Thank you for inviting the Coding Contests Companion to this server. It can show ongoing and upcoming contest information, send notifications before one is about to start, and send daily problems from various popular coding platforms. Use the **/help** command for the user guide. If you're facing any difficulties, feel free to **[join the support server.](https://discord.gg/9sDtq74DMn)**", false, "https://github.com/roshan1337d/coding-contests-companion", true);
        await channelToSend.send({ embeds: [embed] });
    } catch (error) {
        console.log("Joining message error: " + error);
    }
}

module.exports = joiningMessage;
