# Getting started

## Project installation
Install the dependencies
```
$ npm install
```

## Creating a new Discord Bot
- Navigate and login to [discord developer portal](https://discord.com/developers)
- Create a new application
- Add a new bot to the application
- Create a new server for testing
- Add the bot to this server by navigating to the OAuth2 tab and selecting the 'bot' scope and following the generated URL
- Create a new `.env` file in the main folder and copy the bot token to a `DISCORD_TOKEN` variable

## Environment Variables
[dotenv](https://www.npmjs.com/package/dotenv) 
is used to read environment variables from the `.env` file.
The following current environment variables are used:
- DISCORD_TOKEN

## Running the bot
```
$ npm start
```
The [nodemon](https://www.npmjs.com/package/nodemon) library will automatically restart the bot whenever a new change is detected.
