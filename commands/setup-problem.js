const { SlashCommandBuilder, SlashCommandChannelOption, PermissionFlagsBits } = require('discord.js');

const buildEmbed = require("../utility/buildEmbed");

// setup-problem command for turning problem of the day service on for a server
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-problem')
        .addChannelOption(
            new SlashCommandChannelOption()
                .setName('channel')
                .setDescription('Select the channel where daily problems will be sent')
                .setRequired(true)
        )
        .setDescription('Setup problem of the day'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Only the admin can use this command
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = buildEmbed('Permissions Error', 'You need to be an **Administrator** to run this command!')
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        // The bot should be able to send messages in the selected channels
        const channel = interaction.options.getChannel('channel');
        if (!channel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.SendMessages)) {
            const embed = buildEmbed('Permissions Error', 'The bot needs to have **Send Messages** premission in the selected channel!')
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        // Save server and channel data to db and send a confirmation message
        await interaction.client.database.saveProblemChannel(interaction.guildId, channel.id);
        const embed = buildEmbed('Service Activated', 'Problem of the day service has been actived for you server!')
        await interaction.editReply({ embeds: [embed] });
    },
};
