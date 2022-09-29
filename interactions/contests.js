const { EmbedBuilder } = require('discord.js');

// Data about the different supported platforms
const platforms = {
    'codechef': { 'name': 'CodeChef', 'url': 'https://www.codechef.com', 'thumb': 'https://i.imgur.com/XdBzq6c.jpg' },
    'leetcode': { 'name': 'LeetCode', 'url': 'https://leetcode.com', 'thumb': 'https://i.imgur.com/slIjkP3.jpg' },
    'hackerrank': { 'name': 'HackerRank', 'url': 'https://www.hackerrank.com', 'thumb': 'https://i.imgur.com/sduFQNq.jpg' },
    'codeforces': { 'name': 'CodeForces', 'url': 'https://codeforces.com', 'thumb': 'https://i.imgur.com/EVmQOW5.jpg' },
}

// Updates the embed from /contests command when the select menu is used
async function contestsSelect(interaction) {
    if (!interaction.isSelectMenu()) return;
    if (interaction.customId != 'contestsSelect') return;

    await interaction.deferUpdate();

    // Get the platform from interaction and fetch its contests data from db
    const platform = interaction.values.toString();
    let data = await interaction.client.database.getPlatformContests(platform);

    // Format the contests data for the embed body
    let respStr = "";
    let ongoingTextSent = false;
    let upcomingTextSent = false;
    for (let i = 0; i < data.length; i++) {
        let contestData = data[i];
        let ongoing = (contestData['start'] < Math.floor(Date.now() / 1000));
        let hours = Math.floor(contestData['duration'] / 3600);
        let mins = Math.floor((contestData['duration'] / 60) % 60);
        let durationLeft = contestData['duration'] + contestData['start'] - Date.now() / 1000;
        let hoursLeft = Math.floor(durationLeft / 3600);
        let minsLeft = Math.floor((durationLeft / 60) % 60);
        if (ongoing) {
            if (!ongoingTextSent) {
                respStr += "**ONGOING CONTESTS**\n";
                ongoingTextSent = true;
            }
            respStr += `**[${contestData['name']}](${contestData['url']})**\n:stopwatch: ${hoursLeft} ${hoursLeft === 1 ? 'hour' : 'hours'} and ${minsLeft} ${minsLeft === 1 ? 'minute' : 'minutes'} left`;
        }
        else {
            if (!upcomingTextSent) {
                respStr += "**UPCOMING CONTESTS**\n";
                upcomingTextSent = true;
            }
            respStr += `**[${contestData['name']}](${contestData['url']})**\n:calendar: <t:${contestData['start']}:D> at <t:${contestData['start']}:t>\n:stopwatch: ${hours} ${hours === 1 ? 'hour' : 'hours'}${mins === 0 ? '' : (' and ' + mins + ' minutes')}`;
        }
        if (i !== data.length - 1) respStr += "\n\n";
    }
    if (!data.length) respStr += "**No scheduled contests**\n\u200b";

    // Create the embed and send it
    const embed = new EmbedBuilder()
        .setColor(0x1089DF)
        .setTitle(platforms[platform]['name'].toUpperCase())
        .setURL(platforms[platform]['url'])
        .setDescription(respStr + "** **")
        .setImage(platforms[platform]['thumb']);
    await interaction.editReply({ embeds: [embed] });
}

module.exports = contestsSelect;