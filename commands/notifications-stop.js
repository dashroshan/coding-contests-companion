const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// notifications-stop command for a server to stop receiving notifictions
module.exports = {
    data: new SlashCommandBuilder()
        .setName('notifications-stop')
        .setDescription('Stop coding contest notifications'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Only the admin can use this command
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.editReply({ content: 'You need to be an **Administrator** to run this command!', ephemeral: true });
            return;
        }

        // Remove server from the bot db and send a confirmation message
        if (!(await interaction.client.database.deleteSever(interaction.guildId)))
            interaction.editReply({ content: 'Notifications service was not active for you server.', ephemeral: true });
        else interaction.editReply({ content: 'Notifications stopped. Your server members will no longer be notified about any coding contests.', ephemeral: true });
    },
};