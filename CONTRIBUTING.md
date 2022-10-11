I am open to, and grateful for any contributions made by the community to help develop this discord bot. Please go through this document once before you contribute or open a pull request.

# General Information

## Made With

- JavaScript and Node.js
- Puppeteer, Axios, and jsDom for scraping the contest details
- Discord.js for interacting with Discord
- MonogDB as the database
- Moongoose for interacting with MongoDB
- Microsoft Azure for hosting the bot

## Folder Structure

| File or Folder | Use|
| --- | --- |
| index.js | Main entry file which initializes everything and starts the bot |
| deploy.js | Push all the slash commands to discord |
| commands | All the slash commands |
| interactions | All the interaction hooks for things like button press, select change etc |
| database | The mongo.js contains all the database operations, and the schema folder contains the document schemas |
| loops | The contests scraping.js file fetches the latest contest details from various platforms, contest message.js file sends the contest notifications, problem message.js file send the daily problems, and changing activity.js file changes the bot activity every 15 seconds |
| utility | The embed message.js file sends or returns embed messages, joining message.js file sends a message on joining a new server |

# Setup Instructions

## 1. Local Setup

Clone this repository and install all required dependencies using `npm install`

## 2. Create config.json File

A config.json file present in the same location as the index.js file contains all the bot secret configurations and hence not available publicly on this repo. The format is given below. You need to create one and update the following: `guildId`, `clientIdTest`, `tokenTest`, `mongourlTest`

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


## 3. Create Discord Bot Account

1. Open the [Discord Developers Portal.](https://discord.com/developers/applications)

2. Switch to `Applications` tab and then click the `New Application` button, enter your desired bot name and click `Create`.

3. Switch to `Bot` tab, click `Add Bot`, and confirm `Yes, do it!`. Click on `Reset Token` and copy the new token (this is the `tokenTest` for config.json file).

4. Switch to `General Information` tab, copy the `APPLICATION ID` (this is the `clientIdTest` for config.json file), and invite the bot to your test server using the below link by replacing the `{APPLICATION_ID_HERE}`
    ```sh
    https://discord.com/oauth2/authorize?client_id={APPLICATION_ID_HERE}&permissions=268435456&scope=bot%20applications.commands
    ```

## 4. Other config.json Parameters

1. When you open your test server on discord, the link will be in the below format. Get the `guildId` from here.

    ```
    https://discord.com/channels/guildId/channelId
    ```

2. Setup MongoDB server locally or create a MongoDB Atlas account, and get the connection url (look this up on YouTube as it is beyond the scope of this setup instruction). This will be the `mongourlTest`.

## 5. Finishing Up

1. Deploy the slash commands once using `node deploy.js`
2. Run the bot using `node index.js`