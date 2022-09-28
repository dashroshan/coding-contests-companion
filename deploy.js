const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientIdTest, clientIdProd, guildId, tokenTest, tokenProd, isProduction } = require('./config.json');
const rest = new REST({ version: '10' }).setToken(isProduction ? tokenProd : tokenTest);

// Fetch and store all the slash commands from the commands folder
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

// Register all the fetched slash commands on discord
if (isProduction)
    rest.put(Routes.applicationCommands(isProduction ? clientIdProd : clientIdTest), { body: commands })
        .then(() => console.log('Successfully registered global application commands!'))
        .catch(console.error);
else
    rest.put(Routes.applicationGuildCommands(isProduction ? clientIdProd : clientIdTest, guildId), { body: commands })
        .then(() => console.log('Successfully registered server application commands!'))
        .catch(console.error);