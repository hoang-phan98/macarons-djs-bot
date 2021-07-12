import dotenv from 'dotenv';
import { Client } from 'discord.js';

dotenv.config();

const client = new Client()
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)
})

client.login(process.env.DISCORD_TOKEN);