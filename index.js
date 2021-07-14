import dotenv from 'dotenv';
import { Client } from 'discord.js';
import command from './command';

dotenv.config();

const client = new Client()
var victim

const giveRole = (member) => {
    const role = member.guild.roles.cache.find((role) => role.name === 'Muted')
    if (role) {
        member.roles.add(role)
        console.log('Muted ' + member.id)
    } 
}

const removeRole = (member) => {
    const role = member.guild.roles.cache.find((role) => role.name === 'Muted')
    if (role) {
        member.roles.remove(role)
        console.log('Unmuted ' + member.id)
    }
}

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)

    command(client, 'annoy', (message) => {
        victim = message.mentions.users.first()
    })

    command(client, 'mute', message => {
        //!mute @user
        const { member, channel, content, mentions } = message
        const { guild } = member 

        //Check if bot has permission
        if(!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command.')
            return
        }
        
        //Split the command
        const split = content.trim().split(' ')
        console.log(split)
        
        //Check if command tags a user
        if (split.length !==2 ) {
            channel.send('Please mention a user to mute.')
            return
        }
        
        const target = mentions.users.first()

        if(!target) {
            channel.send('User not found.')
            return
        } else {
            const targetMember = guild.members.cache.get(target.id)
            console.log(targetMember)
            giveRole(targetMember)
            channel.send('Muted ' + target.tag)
        }
        
    })

    command(client, 'unmute', message => {
        const { member, channel, content, mentions } = message
        const { guild } = member 

        //Check if bot has permission
        if(!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command.')
            return
        }
        
        //Split the command
        const split = content.trim().split(' ')
        console.log(split)
        
        //Check if command tags a user
        if (split.length !==2 ) {
            channel.send('Please mention a user to unmute.')
            return
        }

        const target = mentions.users.first()

        if(!target) {
            channel.send('User not found.')
            return
        } else {
            const targetMember = guild.members.cache.get(target.id)
            console.log(targetMember)
            removeRole(targetMember)
            channel.send('Unmuted ' + target.tag)
        }
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