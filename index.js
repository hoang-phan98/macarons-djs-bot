import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import Discord, { Client } from "discord.js";
import command from "./command";
import { audio, annoyingMessages, emojiList } from "./config.json";

dotenv.config();

const client = new Client();
var victim;
var dispatcher;

const giveRole = (member) => {
  const role = member.guild.roles.cache.find((role) => role.name === "Muted");
  if (role) {
    member.roles.add(role);
    console.log("Muted " + member.id);
  }
};

const removeRole = (member) => {
  const role = member.guild.roles.cache.find((role) => role.name === "Muted");
  if (role) {
    member.roles.remove(role);
    console.log("Unmuted " + member.id);
  }
};

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in!`);

  command(client, "annoy", (message) => {
    const { member } = message

    if (!member.hasPermission("ADMINISTRATOR")) {
      channel.send("You do not have permission to run this command.");
      return;
    }

    victim = message.mentions.users.first();

    // join the same voice channel as the victim
    const victimMember = message.guild.members.cache.get(victim.id);
    const channel = victimMember.voice.channel;
    if (channel) {
      channel.join();
    }
  });

  command(client, "mercy", (message) => {
    const { member, guild } = message
    if (member.id === victim.id || !member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("You do not have permission to use this command")
      return
    } else {
      victim = undefined
      const clientVoiceConnection = guild.voice
      if (clientVoiceConnection) {
        clientVoiceConnection.channel.leave();
      }
    }
  })

  command(client, "meme", (message) => {
    // Get the meme
    axios.get("https://www.reddit.com/r/memes/.json").then((res) => {
      // Random number
      let number = Math.floor(Math.random() * res.data.data.children.length);

      //Create the embed message
      const embed = new Discord.MessageEmbed()
        .setTitle("Here is a random meme!")
        .setImage(res.data.data.children[number].data.url);

      //Send message to the chat
      message.channel.send(embed);
    });
  });

  command(client, "mute", (message) => {
    //!mute @user
    const { member, channel, content, mentions } = message;
    const { guild } = member;

    //Check if bot has permission
    if (!member.hasPermission("ADMINISTRATOR")) {
      channel.send("You do not have permission to run this command.");
      return;
    }

    //Split the command
    const split = content.trim().split(" ");
    console.log(split);

    //Check if command tags a user
    if (split.length !== 2) {
      channel.send("Please mention a user to mute.");
      return;
    }

    const target = mentions.users.first();

    if (!target) {
      channel.send("User not found.");
      return;
    } else {
      const targetMember = guild.members.cache.get(target.id);
      console.log(targetMember);
      giveRole(targetMember);
      channel.send("Muted " + target.tag);
    }
  });

  command(client, "unmute", (message) => {
    const { member, channel, content, mentions } = message;
    const { guild } = member;

    //Check if bot has permission
    if (!member.hasPermission("ADMINISTRATOR")) {
      channel.send("You do not have permission to run this command.");
      return;
    }

    //Split the command
    const split = content.trim().split(" ");
    console.log(split);

    //Check if command tags a user
    if (split.length !== 2) {
      channel.send("Please mention a user to unmute.");
      return;
    }

    const target = mentions.users.first();

    if (!target) {
      channel.send("User not found.");
      return;
    } else {
      const targetMember = guild.members.cache.get(target.id);
      console.log(targetMember);
      removeRole(targetMember);
      channel.send("Unmuted " + target.tag);
    }
  });
});

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  if (victim) {
    // Check if the member is the same as the victim
    if (victim.id === oldMember.member.id) {
      let newUserChannel = newMember.channel;

      // Victim joins a new channel
      if (newUserChannel) {
        newUserChannel.join();

        // Victim disconnects from the channel
      } else {
        const guildId = oldMember.guild.id;
        const clientVoiceConnection = await client.guilds
          .fetch(guildId)
          .then((guild) => guild.voice);

        // If bot is currently connected to a voice channel
        if (clientVoiceConnection) {
          clientVoiceConnection.channel.leave();
        }
      }
    }
  }
});

client.on("guildMemberSpeaking", (member, speaking) => {
  if (victim) {
    if (victim.id === member.id) {
      const clientVoiceConnection = client.voice.connections.first();
      // Check if victim is speaking
      if (speaking.bitfield === 1) {
        // Play audio here
        console.log("Speaking");
        if (clientVoiceConnection) {
          if (dispatcher) {
            // Resume the audio if the dispatcher exists
            dispatcher.resume();

            // Set the dispatcher to null when audio file finishes
            dispatcher.on("finish", () => {
              console.log("Finished");
              dispatcher = undefined;
            });
          } else {
            // Create a new dispatcher and play/replay the audio file
            dispatcher = clientVoiceConnection.play(
              path.join(__dirname, audio)
            );
          }
        }
      } else if (speaking.bitfield === 0) {
        // Stop audio here
        console.log("Stopped");
        if (dispatcher) {
          dispatcher.pause();
        }
      }
    }
  }
});

client.on("message", (message) => {
  if (victim) {
    if (message.author.bot == true) return;

    if (victim.id !== message.author.id) return;

    // Send an annoying message
    var messageContent;
    if (message) {
      messageContent =
        annoyingMessages[Math.floor(Math.random() * annoyingMessages.length)];
    }
    message.reply(messageContent);

    // React to a message with a unicode emoji
    var emojirandom;

    if (message) {
      emojirandom = emojiList[Math.floor(Math.random() * emojiList.length)];
      message.react(emojirandom);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
