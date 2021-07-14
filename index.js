import dotenv from 'dotenv';
import { Client, MessageAttachment } from 'discord.js';
import command from './command';

dotenv.config();

const client = new Client()
var victim

// Meme API, need to install axios
const axios = require('axios');
const Discord = require('discord.js');

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)

    command(client, 'annoy', (message) => {
        victim = message.mentions.users.first()
    })

    //Meme of the day
    command(client, 'meme', (message) => {
        // Get the meme
        axios.get('https://www.reddit.com/r/memes/.json')
            .then((res)=>{
                // Random number
                let number = Math.floor(Math.random() * 27)

                //Create the embed message
                const embed = new Discord.MessageEmbed()
                .setTitle('Here is the meme of the day!')
                .setImage(res.data.data.children[number].data.url)
                
                //Send message to the chat
                message.channel.send(embed)
            })
    })
})

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (victim) {
        // Check if the member is the same as the victim
        if (victim.id === oldMember.member.id) {
            let newUserChannel = newMember.channel
            let oldUserChannel = oldMember.channel

            // Victim joins a new channel
            if (!oldUserChannel && newUserChannel) {
                newUserChannel.join();

            // Victim disconnects from the channel
            } else if (!newUserChannel) {
                const guildId = oldMember.guild.id;
                const clientVoiceConnection = await client.guilds.fetch(guildId).then((guild) => guild.voice)

                // If bot is currently connected to a voice channel
                if (clientVoiceConnection) {
                    clientVoiceConnection.channel.leave()
                }
            }

            // TODO: Get the bot to follow victims across different channels

        } 
    }
})

client.login(process.env.DISCORD_TOKEN);
