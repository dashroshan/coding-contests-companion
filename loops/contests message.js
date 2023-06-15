const { EmbedBuilder } = require('discord.js');

// Data about the different supported platforms
const platforms = {
    'codechef': 'CodeChef',
    'leetcode': 'LeetCode',
    'hackerrank': 'HackerRank',
    'codeforces': 'CodeForces',
    'atcoder': 'AtCoder',
    'geeksforgeeks': 'Geeksforgeeks',
    'codingninjas': 'Coding Ninjas'
}

// Send notifications for the contests starting soon
async function notify(client) {
    const contests = await client.database.getContestsStartingSoon();
    if (contests.length === 0) return; // No contests starting soon

    // Format the information about the contests starting soon for the embed body
    let respStr = "";
    for (let i = 0; i < contests.length; i++) {
        let contestData = contests[i];
        let hours = Math.floor(contestData['duration'] / 3600);
        let mins = Math.floor((contestData['duration'] / 60) % 60);
        respStr += `**[${contestData['name']}](${contestData['url']})**\n:dart: **Platform:** ${platforms[contestData['platform']]}\n:calendar: **Start:** <t:${contestData['start']}:R>\n:stopwatch: **Duration:** ${hours} ${hours === 1 ? 'hour' : 'hours'}${mins === 0 ? '' : (' and ' + mins + ' minutes')}`;
        if (i !== contests.length - 1) respStr += "\n\n";
    }

    // Create the embed to be sent to all channels
    const embed = new EmbedBuilder()
        .setColor(0x1089DF)
        .setTitle((contests.length === 1) ? 'CODING CONTEST STARTING SOON' : 'CODING CONTESTS STARTING SOON')
        .setImage('https://i.imgur.com/o76L2rG.jpg')
        .setDescription(respStr);

    // Send the embed with their respective role ping to all the channels in db
    const channels = await client.database.getContestChannels();
    for (let channelData of channels) {
        try {
            let channel = await client.channels.fetch(channelData['channel']);
            await channel.send({ content: `<@&${channelData['roleToPing']}>`, embeds: [embed] });
        } catch (error) {
            // Delete the channel from db if bot was unable to access it
            await client.database.deleteContestChannel(channelData['channel']);
        }
    }
}

// Run the notify function once on load, and then every 15 minutes
async function notifyLoop(client) {
    console.log("Notifications loop started.");
    await notify(client);
    setInterval(async () => {
        await notify(client);
    }, 900000);
}

module.exports = notifyLoop;