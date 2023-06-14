const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Data about the different supported platforms
const platforms = {
    'codechef': { 'name': 'CodeChef', 'url': 'https://www.codechef.com', 'thumb': 'https://i.imgur.com/XdBzq6c.jpg' },
    'leetcode': { 'name': 'LeetCode', 'url': 'https://leetcode.com', 'thumb': 'https://i.imgur.com/slIjkP3.jpg' },
    'hackerrank': { 'name': 'HackerRank', 'url': 'https://www.hackerrank.com', 'thumb': 'https://i.imgur.com/sduFQNq.jpg' },
    'codeforces': { 'name': 'CodeForces', 'url': 'https://codeforces.com', 'thumb': 'https://i.imgur.com/EVmQOW5.jpg' },
    'atcoder': { 'name': 'AtCoder', 'url': 'https://atcoder.jp', 'thumb': 'https://i.imgur.com/mfB9fEI.jpg' },
    'hackerearth': { 'name': 'HackerEarth', 'url': 'https://www.hackerearth.com', 'thumb': 'https://i.imgur.com/CACYwoz.jpg' },
    'geeksforgeeks': { 'name': 'Geeksforgeeks', 'url': 'https://practice.geeksforgeeks.org', 'thumb': 'https://i.imgur.com/ejRKy7l.jpg' },
    'codingninjas': { 'name': 'Coding Ninjas', 'url': 'https://www.codingninjas.com', 'thumb': 'https://i.imgur.com/X9WJiRv.png'}
}

// Total contests to show per page
// This is needed due to the 4k character limit of the embed description
const contestsPerPage = 6;

// Updates the embed from /contests command when the select menu is used
async function contestsPaginate(interaction) {
    let pageNum;
    let platform;

    // To handle both the select menu, and the previous and next page buttons
    if (interaction.isButton()) {
        if (interaction.customId.substring(0, 14) != 'contestsButton') return;
        pageNum = parseInt(interaction.customId.substring(14, 15), 10);
        platform = interaction.customId.substring(15, interaction.customId.length);
    }
    else if (interaction.isSelectMenu()) {
        if (interaction.customId != 'contestsSelect') return;
        pageNum = 0;
        platform = interaction.values.toString();
    }
    else return;

    // Incase it takes longer than 3 seconds to respond
    await interaction.deferUpdate();

    // Get the platform from interaction and fetch its contests data from db
    let data = await interaction.client.database.getPlatformContests(platform);

    // Format the contests data for the embed body
    let respStr = "";
    let ongoingTextSent = false;
    let upcomingTextSent = false;
    let contestsCount = data.length - contestsPerPage * pageNum;
    let maxContests = pageNum * contestsPerPage + ((contestsCount > contestsPerPage) ? contestsPerPage : contestsCount);
    for (let i = pageNum * contestsPerPage; i < maxContests; i++) {
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
            respStr += `**[${contestData['name']}](${contestData['url']})**\n:stopwatch: **Time left:** ${hoursLeft} ${hoursLeft === 1 ? 'hour' : 'hours'} and ${minsLeft} ${minsLeft === 1 ? 'minute' : 'minutes'}`;
        }
        else {
            if (!upcomingTextSent) {
                respStr += "**UPCOMING CONTESTS**\n";
                upcomingTextSent = true;
            }
            respStr += `**[${contestData['name']}](${contestData['url']})**\n:calendar: **Start:** <t:${contestData['start']}:D> at <t:${contestData['start']}:t>\n:stopwatch: **Duration:** ${hours} ${hours === 1 ? 'hour' : 'hours'}${mins === 0 ? '' : (' and ' + mins + ' minutes')}`;
        }
        if (i !== maxContests - 1) respStr += "\n\n";
    }
    if (!maxContests) respStr += "**No scheduled contests**\n\u200b";

    // Previous and Next page buttons incase total contests exceeed contestsPerPage
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`contestsButton${pageNum - 1}${platform}`)
                .setLabel('Previous Page')
                .setDisabled(!(pageNum > 0))
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`contestsButton${pageNum + 1}${platform}`)
                .setLabel('Next Page')
                .setDisabled(!(contestsCount > contestsPerPage))
                .setStyle(ButtonStyle.Primary),
        );

    // Select menu for switching to other platforms
    const row2 = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('contestsSelect')
                .setPlaceholder('Select contest platform')
                .addOptions(
                    {
                        label: 'CodeChef',
                        value: 'codechef',
                        emoji: { id: '1024020300834279484' },
                    },
                    {
                        label: 'LeetCode',
                        value: 'leetcode',
                        emoji: { id: '1024019529283674183' },
                    },
                    {
                        label: 'HackerRank',
                        value: 'hackerrank',
                        emoji: { id: '1024019532190339193' },
                    },
                    {
                        label: 'CodeForces',
                        value: 'codeforces',
                        emoji: { id: '1024341762166243348' },
                    },
                    {
                        label: 'AtCoder',
                        value: 'atcoder',
                        emoji: { id: '1025657008688484363' },
                    },
                    {
                        label: 'HackerEarth',
                        value: 'hackerearth',
                        emoji: { id: '1025657011360243782' },
                    },
                    {
                        label: 'Geeksforgeeks',
                        value: 'geeksforgeeks',
                        emoji: { id: '1110941777260711986' }
                    },
                    {
                        label: 'Coding Ninjas',
                        value: 'codingninjas',
                        emoji: { id: '1118598468978618518' }
                    }
                ),
        );

    // Don't add previous and next page buttons if total contests is less than contestsPerPage
    const rows = [];
    rows.push(row2);
    if (data.length > contestsPerPage) rows.push(row1);

    // Create the embed
    let embed = new EmbedBuilder()
        .setColor(0x1089DF)
        .setTitle(platforms[platform]['name'].toUpperCase())
        .setURL(platforms[platform]['url'])
        .setDescription(respStr + "** **")
        .setImage(platforms[platform]['thumb']);

    // Set current page number in footer if paginated
    if (data.length > contestsPerPage) embed.setFooter({ text: `Current page ${pageNum + 1}/${Math.trunc(data.length / contestsPerPage) + 1}` });

    // Send the embed with the components
    await interaction.editReply({ embeds: [embed], components: rows });
}

module.exports = contestsPaginate;