const { ActivityType } = require('discord.js');

async function activity(client) {
    let i = 0;
    setInterval(() => {
        const activities = [`${client.guilds.cache.size} servers`, "/help for user guide"]
        client.user.setActivity(activities[i], { type: ActivityType.Watching });
        i = 1 - i;
    }, 15000);
}

module.exports = activity;
