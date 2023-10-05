const { EmbedBuilder } = require('discord.js');

// Data about the different supported platforms
const platforms = {
    'codechef': 'CodeChef',
    'leetcode': 'LeetCode',
    'hackerrank': 'HackerRank',
    'codeforces': 'CodeForces',
    'atcoder': 'AtCoder',
    'geeksforgeeks': 'Geeksforgeeks',
    'codingninjas': 'CodingNinjas',
    'hackerearth': 'HackerEarth',
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours.toString().padStart(2, "0") + ':' + minutes.toString().padStart(2, "0") + ampm;
    return strTime;
}
// Send notifications for the contests starting soon
async function notify(client) {
    const contests = await client.database.getContestsStartingSoon();
    if (contests.length === 0) return; // No contests starting soon

    const nextContests = await client.database.getNextXContests(5);

    // Format the information about the contests starting soon for the embed body
    let respStr = "";
    let telegramStr = "❇️❇️ *Coding contest starting soon* ❇️❇️";
    for (let i = 0; i < contests.length + nextContests.length; i++) {
        let contestData;
        if (i == contests.length) telegramStr += `\n\n❇️❇️ *Next five scheduled contests* ❇️❇️`;
        if (i >= contests.length)
            contestData = nextContests[i - contests.length];
        else
            contestData = contests[i];

        let hours = Math.floor(contestData['duration'] / 3600);
        let mins = Math.floor((contestData['duration'] / 60) % 60);
        let time = `${hours} ${hours === 1 ? 'hour' : 'hours'}${mins === 0 ? '' : (' and ' + mins + ' minutes')}`;
        let date = new Date(contestData['start'] * 1000);
        let formattedDate = `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} at ${formatAMPM(date)} for ${hours}H:${mins.toString().padStart(2, "0")}M`;
        telegramStr += `\n\n[${contestData['name']}](${contestData['url']})\n🎟️ _${platforms[contestData['platform']]}\n⏰ ${formattedDate}_`;

        if (i < contests.length) {
            respStr += `**[${contestData['name']}](${contestData['url']})**\n:dart: **Platform:** ${platforms[contestData['platform']]}\n:calendar: **Start:** <t:${contestData['start']}:R>\n:stopwatch: **Duration:** ${time}`;
            if (i !== contests.length - 1) respStr += "\n\n";
        }
    }

    // Send message on telegram channel
    client.telegramBot.sendPhoto(client.channelTelegram, "https://i.imgur.com/KCnOAHf.jpg", { caption: telegramStr, parse_mode: "Markdown", disable_web_page_preview: true })

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