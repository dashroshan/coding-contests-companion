const embedMessage = require('../utility/embed message');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

// contests command to view ongoing and upcoming coding contests
module.exports = {
    data: new SlashCommandBuilder()
        .setName('contests')
        .setDescription('View ongoing and upcoming coding contests'),
    async execute(interaction) {
        await interaction.deferReply();

        // Create the embed and selection box
        const embed = await embedMessage(interaction, 'CODING CONTESTS', 'Select a contest platform using the selection box below. CodeChef, LeetCode, HackerRank, CodeForces, AtCoder, HackerEarth, and Google KickStart are the currently available platforms. Support for more platforms coming soon :sparkles:', false, 'https://github.com/roshan1337d/coding-contests-companion', true);
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
                            label: 'Google KickStart',
                            value: 'kickstart',
                            emoji: { id: '1026701223224688711' },
                        }
                    ),
            );

        // Send the embed with the selection box
        return interaction.editReply({ embeds: [embed], components: [row] });
    },
};