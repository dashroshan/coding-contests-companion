const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Data about the different supported platforms
const platforms = {
    'codechef': { 'name': 'CodeChef', 'url': 'https://www.codechef.com', 'thumb': 'https://i.imgur.com/XdBzq6c.jpg' },
    'leetcode': { 'name': 'LeetCode', 'url': 'https://leetcode.com', 'thumb': 'https://i.imgur.com/slIjkP3.jpg' },
    'hackerrank': { 'name': 'HackerRank', 'url': 'https://www.hackerrank.com', 'thumb': 'https://i.imgur.com/sduFQNq.jpg' },
    'codeforces': { 'name': 'CodeForces', 'url': 'https://codeforces.com', 'thumb': 'https://i.imgur.com/EVmQOW5.jpg' },
    'atcoder': { 'name': 'AtCoder', 'url': 'https://atcoder.jp', 'thumb': 'https://i.imgur.com/mfB9fEI.jpg' },
    'hackerearth': { 'name': 'HackerEarth', 'url': 'https://www.hackerearth.com', 'thumb': 'https://i.imgur.com/CACYwoz.jpg' },
    'geeksforgeeks': { 'name': 'Geeksforgeeks', 'url': 'https://practice.geeksforgeeks.org', 'thumb': 'https://i.imgur.com/ejRKy7l.jpg' },
    'codingninjas': { 'name': 'Coding Ninjas', 'url': 'https://www.codingninjas.com', 'thumb': 'https://i.imgur.com/X9WJiRv.png' }
}

// Total contests to show per page
// This is needed due to the 4k character limit of the embed description
const contestsPerPage = 6;

// Updates the embed from /contests command when the select menu is used
async function contestsInPaginate(interaction, commandType) {
    let pageNum;
    let days;

    // To handle both the select menu, and the previous and next page buttons
    if (interaction.isButton()) {
        if (interaction.customId.substring(0, 16) != 'contestsInButton') return;
        pageNum = parseInt(interaction.customId.substring(16, 17), 10);
        days = parseInt(interaction.customId.substring(17, 18), 10);
    }
    else if (interaction.isCommand() && commandType) {
        days = interaction.options.getNumber("start");
        pageNum = 0;
        if (days == null) return;
    }
    else return;

    // Incase it takes longer than 3 seconds to respond
    if (!commandType)
        await interaction.deferUpdate();

    // Get the platform from interaction and fetch its contests data from db
    let data = await interaction.client.database.getContestsStartingInXDays(days);

    // Format the contests data for the embed body
    let respStr = "";
    let contestsCount = data.length - contestsPerPage * pageNum;
    let maxContests = pageNum * contestsPerPage + ((contestsCount > contestsPerPage) ? contestsPerPage : contestsCount);
    for (let i = pageNum * contestsPerPage; i < maxContests; i++) {
        let contestData = data[i];
        let hours = Math.floor(contestData['duration'] / 3600);
        let mins = Math.floor((contestData['duration'] / 60) % 60);
        respStr += `**[${contestData['name']}](${contestData['url']})**\n:calendar: **Start:** <t:${contestData['start']}:D> at <t:${contestData['start']}:t>\n:stopwatch: **Duration:** ${hours} ${hours === 1 ? 'hour' : 'hours'}${mins === 0 ? '' : (' and ' + mins + ' minutes')}\n:flags: **Platform:** ${platforms[contestData['platform']]['name']}`;
        if (i !== maxContests - 1) respStr += "\n\n";
    }
    if (!maxContests) respStr += "**No scheduled contests**\n\u200b";

    // Previous and Next page buttons incase total contests exceeed contestsPerPage
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`contestsInButton${pageNum - 1}${days}`)
                .setLabel('Previous Page')
                .setDisabled(!(pageNum > 0))
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`contestsInButton${pageNum + 1}${days}`)
                .setLabel('Next Page')
                .setDisabled(!(contestsCount > contestsPerPage))
                .setStyle(ButtonStyle.Primary),
        );

    // Don't add previous and next page buttons if total contests is less than contestsPerPage
    const rows = [];
    if (data.length > contestsPerPage) rows.push(row1);

    // Create the embed
    let embed = new EmbedBuilder()
        .setColor(0x1089DF)
        .setTitle(`CONTESTS IN ${days} DAYS`)
        .setDescription(respStr + "** **")
        .setImage("https://i.imgur.com/Sj1bgx5.jpg")

    // Set current page number in footer if paginated
    if (data.length > contestsPerPage) embed.setFooter({ text: `Current page ${pageNum + 1}/${Math.trunc(data.length / contestsPerPage) + 1}` });

    // Send the embed with the components
    await interaction.editReply({ embeds: [embed], components: rows });
}

module.exports = contestsInPaginate;