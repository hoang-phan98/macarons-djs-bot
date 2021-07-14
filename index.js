import dotenv from 'dotenv';
import { Client, MessageAttachment } from 'discord.js';
import path from 'path';
import { Client } from 'discord.js';
import command from './command';
import { audio } from "./config.json";

dotenv.config();

const client = new Client()
var victim
var dispatcher

// Meme API, need to install axios
const axios = require('axios');
const Discord = require('discord.js');

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)

    command(client, 'annoy', (message) => {
        victim = message.mentions.users.first()
        console.log(message.guild.members.cache.get(victim.id))
        const member = message.guild.members.cache.get(victim.id)
        const channel = member.voice.channel
        if (channel) {
            channel.join()
        }
    })

    //Meme of the day
    command(client, 'meme', (message) => {
        // Get the meme
        axios.get('https://www.reddit.com/r/memes/.json')
            .then((res)=>{
                // Random number
                let number = Math.floor(Math.random() * res.data.data.children.length)

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

            // Victim joins a new channel
            if (newUserChannel) {
                newUserChannel.join();

            // Victim disconnects from the channel
            } else {
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

client.on('guildMemberSpeaking', (member, speaking) => {
    if (victim) {
        if (victim.id === member.id) {
            const clientVoiceConnection = client.voice.connections.first()
            // Check if victim is speaking
            if (speaking.bitfield === 1) {
                // Play audio here
                console.log("Speaking")
                if (clientVoiceConnection) {
                    if (dispatcher) {
                        dispatcher.resume()
                        dispatcher.on('finish', () => {
                            console.log("Finished")
                            dispatcher = undefined
                        })
                    } else {
                        dispatcher = clientVoiceConnection.play(path.join(__dirname, audio))
                    }
                }
            } else if (speaking.bitfield === 0) {
                // Stop audio here
                console.log("Stopped")
                if (dispatcher) {
                    dispatcher.pause();
                }

            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN);
