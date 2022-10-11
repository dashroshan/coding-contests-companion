const embedMessage = require('../utility/embed message');
const { SlashCommandBuilder } = require('discord.js');

// Convert seconds to the most significant unit among seconds, minutes, hours, or days
function formatTime(seconds) {
    const units = [[1, "s"], [60, "m"], [60 * 60, "h"], [60 * 60 * 24, "d"]];
    let bestUnit = units[0];
    for (const unit of units) {
        if (seconds >= unit[0]) {
            bestUnit = unit;
        }
    }
    const [divisor, label] = bestUnit;
    return Math.floor(seconds / divisor) + label;
}

// stats command to view total server, users, latency, ram usage, and uptime
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View bot stats'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Stats data for the embed body
        let ram = ((process.memoryUsage().heapUsed / 1024 / 1024) + (process.memoryUsage().heapTotal / 1024 / 1024)).toFixed(2);
        let respStr =
            `**\`Servers   \`** \`${interaction.client.guilds.cache.size.toString().padEnd(10)}\`
        **\`Users     \`** \`${interaction.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toString().padEnd(10)}\`
        **\`Latency   \`** \`${(interaction.client.ws.ping.toString() + 'ms').padEnd(10)}\`
        **\`RAM Usage \`** \`${(ram.toString() + 'mb').padEnd(10)}\`
        **\`Uptime    \`** \`${(formatTime(Math.floor(interaction.client.uptime / 1000))).padEnd(10)}\``

        await embedMessage(interaction, 'Bot Stats', respStr, false);
    },
};