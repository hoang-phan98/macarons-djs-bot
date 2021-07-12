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
    })
})

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (victim) {
        // Check if the member is the same as the victim
        if (victim.id === oldMember.member.id) {
            let newUserChannel = newMember.channel
            let oldUserChannel = oldMember.channel

            if (!oldUserChannel && newUserChannel) {
                newUserChannel.join();
            } else if (!newUserChannel) {
                console.log("REACHED")
                const guildId = oldMember.guild.id;
                const clientVoiceConnection = await client.guilds.fetch(guildId).then( (guild) => guild.voice )
                if (clientVoiceConnection) {
                    console.log(clientVoiceConnection)
                    clientVoiceConnection.channel.leave()
                }
            }

        } else {
            return
        }
    } else {
        return
    }
})

client.login(process.env.DISCORD_TOKEN);