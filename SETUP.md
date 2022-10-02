##  Creating a Bot Account

1. Go to [Discord Developers Portal](https://discord.com/developers)

2. Click `Applications` and then add `New Application` button, to enter your desired BOT name and click Create.

3. Go to the `Bot` Tab and click `Add Bot`, and confirm `Yes, do it!`

   > Take note of the `TOKEN` on the Bot tab page. If token is not visible click on `RESET TOKEN`.
   
   > `Bot Permissions` : administrator

   > Keep your token and any file containing it `private`. If it ever leaks or you suspect it may have leaked, simply `regenerate` a new token to invalidate your compromised token.
   
4. Invite the bot using this link by replacing the clientID.
   ```sh
   https://discord.com/oauth2/authorize?client_id={clientIdTest_Here}&permissions=268435456&scope=bot%20applications.commands
   ```
 
5. Go to `OAuth2` Tab and grab the Client ID.
   
   > Select `Scopes : bot` and `Bot Permissions : administrator`
   
   > Paste the generated URL in the browser to invite your bot to your new test server.


## Inviting the BOT to a testing server

* https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands

   > `https://discord.com/api/oauth2/authorize` is Discord's standard structure for authorizing an OAuth2 application (such as your bot application) for entry to a Discord server.
 
   > `client_id=...` is to specify which application you want to authorize. You'll need to replace this part with your client's id to create a valid invite link.
 
   > `permissions=...` describes what permissions your bot will have on the server you are adding it to.
 
   > `scope=bot%20applications.commands` specifies that you want to add this application as a Discord bot, with the ability to create slash commands.

* To create an invite link, head back to the `My Apps` page under the `Applications` section, click on your `bot application`, and open the `OAuth2` page.

* In the sidebar, you'll find the `OAuth2 URL generator`. Select the `bot` and `applications.commands` options. Once you select the bot option, a list of permissions will appear, allowing you to configure the permissions your bot needs.

* Grab the link via the `Copy` button and enter it in your browser.

* `Bot Authorization page` : Choose the server you want to add it to and click `Authorize`. Do note that you'll need the `Manage Server` permission on a server to add your bot there.


##  Creating the config.json file.

A config.json file present in the same location as the index.js file contains all the bot secret configurations and hence not available publicly on this repo. You need to create one and update the `testing_x` attributes in the below format.

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
   
   * `guildId`   : To get the server ID, open Discord, go to `Settings` then `Advanced` and enable `developer mode`. Then, right-click on the server title and select `Copy ID` to get the guild ID.
   
   * `clientId`  : In Discord Developer Portal while creating the BOT in `OAth2` copy the "CLIENT ID".
   
   * `tokenTest` : In Discord Developer Portal while creating the BOT in `BOT`, copy the "TOKEN".
   
   * `mongodb`   : Create MongoDB cluster or with MongoDB community and call the database.
   
   * `isProduction: false`

   * `Bot authorized` : Successfully added your bot to your Discord server.


## Install & Dependencies

* Cloning the Repository

    ```sh
    git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
    ```

* Install dependencies.

    ```sh
    npm install
    ```
 
* Launches the test runner in the interactive watch mode.

    ```sh
    npm test
    ```

* Builds the app for production to the build folder and It correctly bundles React in production mode. Your app is ready to be deployed !

    ```sh
    npm build
    ```
    
* To start the BOT locally !

    ```sh
    npm start
    ```

