const axios = require("axios");
const { EmbedBuilder } = require('discord.js');
const headers = { 'headers': { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' } };

// Get problem of the day from LeetCode
async function problemOfTheDay() {
    const query = await axios.get('https://leetcode.com/graphql?query={ activeDailyCodingChallengeQuestion {link question { difficulty acRate hasSolution title titleSlug topicTags { name } } }}', headers);
    const res = query.data["data"]["activeDailyCodingChallengeQuestion"];
    let name = res["question"]["title"];
    let url = "https://leetcode.com" + res["link"];
    let difficulty = res["question"]["difficulty"];
    let acRate = Math.round(res["question"]["acRate"]);
    let hasSolution = res["question"]["hasSolution"];
    let topics = res["question"]["topicTags"].map(topic => {
        return topic["name"];
    });
    return { name, url, acRate, hasSolution, difficulty, topics };
}

// Send problem of the day to all the channels opted in for it
async function sendProblem(client) {

    // Return if problem for that day is sent already
    const lastDailyProblem = await client.database.getLastDailyProblem();
    const today = new Date();
    if (lastDailyProblem === today.getUTCDate() || today.getUTCHours < 2) return;

    // Get and format the problem for embed body
    const problem = await problemOfTheDay();
    let respStr = "";
    respStr += `**[${problem.name}](${problem.url})**\n\n`;
    respStr += `:muscle: **Difficulty:** ${problem.difficulty}\n`;
    respStr += `:dart: **Acceptance Rate:** ${problem.acRate}%\n`;
    respStr += (problem.hasSolution) ? ':white_check_mark: **Solution: ** Present\n\n' : ':negative_squared_cross_mark: **Solution: ** Absent\n\n';
    respStr += ':pencil: **Concepts:** ';
    for (let [i, topic] of problem.topics.entries()) {
        respStr += topic.toLowerCase();
        if (i === problem.topics.length - 2) respStr += ', and '
        else if (i !== problem.topics.length - 1) respStr += ', ';
    }

    // Create the embed to be sent
    const embed = new EmbedBuilder()
        .setColor(0x1089DF)
        .setTitle('PROBLEM OF THE DAY')
        .setImage('https://i.imgur.com/o76L2rG.jpg')
        .setDescription(respStr);

    // Send the problem to all the channels opted in for it
    const channels = await client.database.getProblemChannels();
    for (let channelData of channels) {
        try {
            let channel = await client.channels.fetch(channelData['channel']);
            await channel.send({ embeds: [embed] });
        } catch (error) {
            await client.database.deleteProblemChannel(channelData['channel']);
        }
    }

    // Set last daily problem sent day to the current day
    await client.database.setLastDailyProblem();
}

// Run the sendProblem function once on load, and then every 1 hour
async function sendProblemLoop(client) {
    console.log("Daily problem loop started.");
    await sendProblem(client);
    setInterval(async () => {
        await sendProblem(client);
    }, 3600000);
}

module.exports = sendProblemLoop;