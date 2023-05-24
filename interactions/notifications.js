// Handle the Notifications button click to add and remove ping role
async function notificationsRole(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId.substring(0, 15) === "notificationsOn") {
        await interaction.deferUpdate();

        // Role ID is stored directly as a part of the button custom ID as 'notifications{ID}'
        const roleId = interaction.customId.substring(
            15,
            interaction.customId.length
        );
        const role = interaction.guild.roles.cache.find((r) => r.id === roleId);

        if (!role) {
            await interaction.followUp({
                content: `Role not found. Please contact the server admin to rerun the notifications commands.`,
                ephemeral: true,
            });
            return;
        }

        // Add role to user or remove it if already present
        if (interaction.member.roles.cache.find((r) => r.id === roleId)) {
            await interaction.followUp({
                content: `You are already reciving the notification - **${role.name}**`,
                ephemeral: true,
            });
        } else {
            await interaction.member.roles.add(role);
            await interaction.followUp({
                content: `**${role.name}** role was added for you!`,
                ephemeral: true,
            });
        }
    } else if (interaction.customId.substring(0, 16) === "notificationsOff") {
        await interaction.deferUpdate();

        // Role ID is stored directly as a part of the button custom ID as 'notifications{ID}'
        const roleId = interaction.customId.substring(
            16,
            interaction.customId.length
        );
        const role = interaction.guild.roles.cache.find((r) => r.id === roleId);

        if (!role) {
            await interaction.followUp({
                content: `Role not found. Please contact the server admin to rerun the notifications commands.`,
                ephemeral: true,
            });
            return;
        }

        // Add role to user or remove it if already present
        if (interaction.member.roles.cache.find((r) => r.id === roleId)) {
            await interaction.member.roles.remove(role);
            await interaction.followUp({
                content: `**${role.name}** role was removed for you!`,
                ephemeral: true,
            });
        } else {
            await interaction.followUp({
                content: `You don't have the role **${role.name}**, first subscribe to the notifications by clicking on **Get Notified** button.`,
                ephemeral: true,
            });
        }
    } else {
        return;
    }
}

module.exports = notificationsRole;
