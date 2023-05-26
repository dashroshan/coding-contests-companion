const embedMessage = require("../utility/embed message");
const {
    SlashCommandBuilder,
    SlashCommandRoleOption,
    SlashCommandChannelOption,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} = require("discord.js");

// setup-contest command for creating a role opting embed and turning the
// contest notifications service on for a server
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-contest")
        .addRoleOption(
            new SlashCommandRoleOption()
                .setName("role")
                .setDescription(
                    "Select the role to ping for contest notifications"
                )
                .setRequired(true)
        )
        .addChannelOption(
            new SlashCommandChannelOption()
                .setName("channel")
                .setDescription(
                    "Select the channel where notifications will be sent"
                )
                .setRequired(true)
        )
        .setDescription("Setup upcoming contest notifications"),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Only the admin can use this command
        if (
            !(
                interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator
                ) || interaction.member.id === "415490428721168384"
            )
        ) {
            await embedMessage(
                interaction,
                "PERMISSIONS ERROR",
                "You need to be an **Administrator** to run this command."
            );
            return;
        }

        // The bot should be able to send messages in the selected channels
        const channel = interaction.options.getChannel("channel");
        if (
            !channel
                .permissionsFor(interaction.client.user)
                .has(PermissionFlagsBits.SendMessages)
        ) {
            await embedMessage(
                interaction,
                "PERMISSIONS ERROR",
                "The bot needs to have **Send Messages** premission in the selected channel."
            );
            return;
        }

        // The bot should be able to manage the selected notifications role
        const role = interaction.options.getRole("role");
        if (!role.editable) {
            await embedMessage(
                interaction,
                "LOWER ROLE ERROR",
                `**${role.name}** role need to be present below the bot role, inorder for the bot to manage it. Open server settings, go to roles, drag the bot role above the ${role.name} role, and run this command again.`
            );
            return;
        }

        // Create the embed for members to opt-in or out of notifications role
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`notificationsOn${role.id}`)
                .setLabel("Get Notified")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`notificationsOff${role.id}`)
                .setLabel("Stop Notifications")
                .setStyle(ButtonStyle.Secondary)
        );
        const embed = await embedMessage(
            interaction,
            "Wish to get notified about coding contests?",
            "Click the **Get Notified** button below to get a role which will be pinged whenever any coding contest on CodeChef, LeetCode, HackerRank, CodeForces, AtCoder, HackerEarth, or Google KickStart is about to start. Click on **Stop Notifications** again to opt-out anytime.",
            false,
            "https://github.com/roshan1337d/coding-contests-companion",
            true
        );

        // Save server and channel data to db and send a confirmation message
        await interaction.client.database.saveContestChannel(
            interaction.guildId,
            channel.id,
            role.id
        );
        await embedMessage(
            interaction,
            "SERVICE ACTIVATED",
            "Upcoming contest notifications service has been actived for your server.",
            false
        );
        await interaction.followUp({ embeds: [embed], components: [row] });
    },
};
