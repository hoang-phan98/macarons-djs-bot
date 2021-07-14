import dotenv from 'dotenv';
import { Client } from 'discord.js';
import command from './command';

dotenv.config();

const client = new Client()
var victim

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

client.login(process.env.DISCORD_TOKEN);