const { SlashCommandBuilder, SlashCommandRoleOption, SlashCommandChannelOption, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

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
            await interaction.editReply({ content: 'You need to be an **Administrator** to run this command!', ephemeral: true });
            return;
        }

        // The bot should be able to send messages in the selected channels
        const channel = interaction.options.getChannel('channel');
        if (!channel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.SendMessages)) {
            await interaction.editReply({ content: 'The bot needs to have **Send Messages** permission in the selected channel!', ephemeral: true });
            return;
        }

        // Save server and channel data to db and send a confirmation message
        await interaction.client.database.saveProblemChannel(interaction.guildId, channel.id);
        await interaction.editReply({ content: 'Problem of the day service has been actived for you server!', ephemeral: true });
    },
};
