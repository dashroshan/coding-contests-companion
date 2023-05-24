// Handle the Notifications button click to add and remove ping role
async function notificationsRole(interaction) {
    if (!interaction.isButton()) return;

    const isOn = interaction.customId.startsWith("notificationsOn");
    const isOff = interaction.customId.startsWith("notificationsOff");
    if (!isOn && !isOff) return;

    await interaction.deferUpdate();

    // Role ID is stored directly as a part of the button custom ID as 'notifications(On/Off){ID}'
    const roleId = interaction.customId.substring(isOn ? 15 : 16);
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
        await interaction.followUp({
            content: `Role not found. Please contact the server admin to rerun the notifications commands.`,
            ephemeral: true,
        });
        return;
    }

    const hasRole = interaction.member.roles.cache.has(roleId);
    if (isOn && hasRole) {
        await interaction.followUp({
            content: `You are already receiving the notification - **${role.name}**`,
            ephemeral: true,
        });
    } else if (isOff && !hasRole) {
        await interaction.followUp({
            content: `You don't have the role **${role.name}**, first subscribe to the notifications by clicking on **Get Notified** button.`,
            ephemeral: true,
        });
    } else {
        if (isOn) {
            await interaction.member.roles.add(role);
            await interaction.followUp({
                content: `**${role.name}** role was added for you!`,
                ephemeral: true,
            });
        } else {
            await interaction.member.roles.remove(role);
            await interaction.followUp({
                content: `**${role.name}** role was removed for you!`,
                ephemeral: true,
            });
        }
    }
}

module.exports = notificationsRole;
