const { SlashCommandBuilder, SlashCommandRoleOption, SlashCommandChannelOption, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

// setup-contest command for creating a role opting embed and turning the
// contest notifications service on for a server
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-contest')
        .addRoleOption(
            new SlashCommandRoleOption()
                .setName('role')
                .setDescription('Select the role to ping for contest notifications')
                .setRequired(true)
        )
        .addChannelOption(
            new SlashCommandChannelOption()
                .setName('channel')
                .setDescription('Select the channel where notifications will be sent')
                .setRequired(true)
        )
        .setDescription('Setup upcoming contest notifications'),
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

        // The bot should be able to manage the selected notifications role
        const role = interaction.options.getRole('role');
        if (!role.editable) {
            await interaction.editReply({ content: `**${role.name}** role need to be present below the bot role, inorder for the bot to manage it. Open server settings, go to roles, drag the bot role above the ${role.name} role, and run this command again.`, ephemeral: true });
            return;
        }

        // Create the embed for members to opt-in or out of notifications role
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`notifications${role.id}`)
                    .setLabel('Notifications')
                    .setStyle(ButtonStyle.Secondary),
            );
        const embed = new EmbedBuilder()
            .setColor(0x1089DF)
            .setURL('http://roshan.cyou')
            .setTitle('Wish to get notified about coding contests?')
            .setDescription('Click the **Notifications** button below to get a role which will be pinged whenever any coding contest on CodeChef, LeetCode, HackerRank, CodeForces, AtCoder, HackerEarth, and Google KickStart is about to start. Click it again to opt-out anytime.');

        // Save server and channel data to db and send a confirmation message
        await interaction.client.database.saveContestChannel(interaction.guildId, channel.id, role.id);
        await interaction.editReply({ content: 'Upcoming contest notifications service has been actived for you server!', ephemeral: true });
        await interaction.followUp({ embeds: [embed], components: [row] });
    },
};
