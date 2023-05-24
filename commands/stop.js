const embedMessage = require("../utility/embed message");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// stop command for a server to stop any running service
module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .addStringOption((option) =>
            option
                .setName("feature")
                .setDescription("Select the service to stop")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Upcoming contest notifications",
                        value: "contest",
                    },
                    { name: "Problem of the day", value: "problem" }
                )
        )
        .setDescription("Stop any service running for your server"),
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
                "You need to be an **Administrator** to run this command!"
            );
            return;
        }

        // Get the feature service to be stopped
        const feature = interaction.options.getString("feature");

        // Remove server from the bot db and send a confirmation message
        if (feature === "contest") {
            if (
                !(await interaction.client.database.deleteContestServer(
                    interaction.guildId
                ))
            )
                await embedMessage(
                    interaction,
                    "INACTIVE SERVICE",
                    "Upcoming contest notifications service was not active for you server."
                );
            else
                await embedMessage(
                    interaction,
                    "SERVICE STOPPED",
                    "Upcoming contest notifications service stopped. Your server members will no longer be notified about any coding contests.",
                    false
                );
        } else if (feature === "problem") {
            if (
                !(await interaction.client.database.deleteProblemServer(
                    interaction.guildId
                ))
            )
                await embedMessage(
                    interaction,
                    "INACTIVE SERVICE",
                    "Problem of the day service was not active for you server."
                );
            else
                await embedMessage(
                    interaction,
                    "SERVICE STOPPED",
                    "Problem of the day service stopped. Your server will no longer recieve daily problems.",
                    false
                );
        }
    },
};
