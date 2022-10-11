const fs = require('node:fs');
const path = require('node:path');
const changingActivityLoop = require('./loops/changing activity');
const contestsScrapingLoop = require('./loops/contests scraping');
const contestsMessageLoop = require('./loops/contests message');
const problemMessageLoop = require('./loops/problem message');
const joiningMessage = require('./utility/joining message');
const { tokenTest, tokenProd, mongourlTest, mongourlProd, isProduction } = require('./config.json');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initilize mongoDB connection
const mongoose = require('mongoose');
client.database = require('./database/mongo.js');
mongoose.connect((isProduction) ? mongourlProd : mongourlTest, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB.'))
    .catch((err) => console.log('Unable to connect to MongoDB.\nError: ' + err));

// Fetch and initilize all the slash commands from the commands folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Fetch and initilize all the interaction hooks from the interactions folder
let interactionCommands = [];
const interactionsPath = path.join(__dirname, 'interactions');
const interactionsFiles = fs.readdirSync(interactionsPath).filter(file => file.endsWith('.js'));
for (const file of interactionsFiles) {
    const filePath = path.join(interactionsPath, file);
    const command = require(filePath);
    interactionCommands.push(command);
}

// On interaction check and run slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
});


// On interaction check and run interaction hooks
client.on('interactionCreate', async interaction => {
    for (const command of interactionCommands) {
        try {
            await command(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

// Sends a joining message in the first channel of the server where it has send messages permission
client.on('guildCreate', async guild => await joiningMessage(guild));

// Start the contests updating loop and notifications sending loop when bot is ready
let loopsInitialized = false;
client.once('ready', () => {
    if (!loopsInitialized) {
        changingActivityLoop(client);
        contestsMessageLoop(client);
        problemMessageLoop(client);
        contestsScrapingLoop(client.database);
        loopsInitialized = true;
    }
    console.log('Bot is online.');
});

// Login and start the discord bot
client.login(isProduction ? tokenProd : tokenTest);
