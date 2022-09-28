const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

// contests command to view ongoing and upcoming coding contests
module.exports = {
    data: new SlashCommandBuilder()
        .setName('contests')
        .setDescription('View ongoing and upcoming coding contests'),
    async execute(interaction) {
        await interaction.deferReply();

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor(0x1089DF)
            .setTitle('CODING CONTESTS')
            .setDescription('Select a contest platform using the selection box below. CodeChef, LeetCode, HackerRank, and CodeForces are the currently available platforms. More platforms support coming soon :sparkles:');

        // Create the selection box
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
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
                    ),
            );

        // Send the embed with the selection box
        return interaction.editReply({ embeds: [embed], components: [row] });
    },
};