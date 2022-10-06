const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const buildEmbed = require('../utility/buildEmbed');

// stop command for a server to stop any running service
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .addStringOption(
            option => option
                .setName('feature')
                .setDescription('Select the service to stop')
                .setRequired(true)
                .addChoices(
                    { name: 'Upcoming contest notifications', value: 'contest' },
                    { name: 'Problem of the day', value: 'problem' }
                )
        )
        .setDescription('Stop any service running for your server'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Only the admin can use this command
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = buildEmbed('Permissions Error', 'You need to be an **Administrator** to run this command!')
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        // Get the feature service to be stopped
        const feature = interaction.options.getString('feature');

        // Remove server from the bot db and send a confirmation message
        if (feature === 'contest') {
            if (!(await interaction.client.database.deleteContestServer(interaction.guildId))) {
                const embed = buildEmbed('Service Stopped', 'Upcoming contest notifications service was not active for you server.')
                await interaction.editReply({ embeds: [embed] });
            }
            else {
                const embed = buildEmbed('Service Stopped', 'Upcoming contest notifications service stopped. Your server members will no longer be notified about any coding contests.')
                await interaction.editReply({ embeds: [embed] })
            }
        }
        else if (feature === 'problem') {
            if (!(await interaction.client.database.deleteProblemServer(interaction.guildId))) {
                const embed = buildEmbed('Service Stopped', 'Problem of the day service was not active for you server.')
                await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = buildEmbed('Service Stopped', 'Problem of the day service stopped. Your server will no longer recieve daily problems.')
                await interaction.editReply({ embeds: [embed] });
            }
        }
    },
};