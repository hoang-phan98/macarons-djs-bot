import dotenv from 'dotenv';
import { Client } from 'discord.js';
import command from './command';

dotenv.config();

const client = new Client()
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)

    // Using the command handler to get the bot respond to "!ping" with "pong"
    command(client, 'ping', (message) => {
        message.channel.send('pong!')
    })
})

client.login(process.env.DISCORD_TOKEN);