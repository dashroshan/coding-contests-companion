// Handle the Notifications button click to add and remove ping role
async function notificationsRole(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId.substring(0, 13) != 'notifications') return;

    await interaction.deferUpdate();

    // Role ID is stored directly as a part of the button custom ID as 'notifications{ID}'
    const roleId = interaction.customId.substring(13, interaction.customId.length);
    const role = interaction.guild.roles.cache.find(r => r.id === roleId);

    if (!role) {
        await interaction.followUp({ content: `Role not found. Please contact the server admin to rerun the notifications commands.`, ephemeral: true });
        return;
    }

    // Add role to user or remove it if already present
    if (interaction.member.roles.cache.find(r => r.id === roleId)) {
        await interaction.member.roles.remove(role);
        await interaction.followUp({ content: `**${role.name}** role was removed for you!`, ephemeral: true });
    }
    else {
        await interaction.member.roles.add(role);
        await interaction.followUp({ content: `**${role.name}** role was added for you!`, ephemeral: true });
    }
}

module.exports = notificationsRole;