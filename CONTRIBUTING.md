# Contributing

I am open to, and grateful for, any contributions made by the community to help develop this discord bot. Please go through this document once completely before you contribute or open a pull request.

## Made With

- JavaScript and Node.js
- Axios for scraping the contest details
- Discord.js for interacting with Discord
- MonogDB as the database
- Moongoose for interacting with MongoDB
- Microsoft Azure for hosting the bot

## Directories

| File or Folder | Use|
| --- | --- |
| index.js | Main entry file which initializes everything and starts the bot|
| deploy.js | Push all the slash commands to discord |
| commands | All the slash commands |
| interactions | All the interaction hooks for things like button press, select change etc |
| database | The mongo.js contains all the database operations, and the schema folder contains the document schemas |
| utility | The contests scraping.js file fetches the latest contest details from various platforms, contest message.js file sends the contest notifications, and problem message.js file send the daily problems |

## config.json

A config.json file present in the same location as the index.js file contains all the bot secret configurations and hence not available publicly on this repo. You need to create one and update the testing_x attributes in the below format:

```json
{
    "guildId": "testing_server_id",
    "clientIdTest": "testing_bot_id",
    "clientIdProd": "production_bot_id",
    "tokenTest": "testing_bot_token",
    "tokenProd": "production_bot_token",
    "mongourlTest": "testing_mongodb_url/db",
    "mongourlProd": "production_mongodb_url/db",
    "isProduction": false
}
```

## Developing

Create a test bot in the [discord developers portal](https://discord.com/developers), add it to your testing server, update the config.json file, run the bot with `node index.js` command.

## Submit

Open a pull request with your changes describing in the best possible way what you have done.