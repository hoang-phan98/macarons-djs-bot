import dotenv from "dotenv";
import { Client } from "discord.js";
import command from "./command";
import config from "./config.json";

dotenv.config();

const client = new Client();
var victim;

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in!`);

  command(client, "annoy", (message) => {
    victim = message.mentions.users.first();
  });
});

client.on("message", (message) => {
  if (victim) {
    if (message.author.bot == true) return;

    if (victim.id !== message.author.id) return;

    // Send an annoying message
    var annoyingMessages = config.annoyingMessages;
    var messageContent;
    if (message) {
      messageContent =
        annoyingMessages[Math.floor(Math.random() * annoyingMessages.length)];
    }
    message.reply(messageContent);

    // React to a message with a unicode emoji
    var emojiList = config.emojiList;
    var emojirandom;

    if (message) {
      emojirandom = emojiList[Math.floor(Math.random() * emojiList.length)];
      message.react(emojirandom);
    }
  }
});

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  if (victim) {
    // Check if the member is the same as the victim
    if (victim.id === oldMember.member.id) {
      let newUserChannel = newMember.channel;
      let oldUserChannel = oldMember.channel;

      // Victim joins a new channel
      if (!oldUserChannel && newUserChannel) {
        newUserChannel.join();

        // Victim disconnects from the channel
      } else if (!newUserChannel) {
        const guildId = oldMember.guild.id;
        const clientVoiceConnection = await client.guilds
          .fetch(guildId)
          .then((guild) => guild.voice);

        // If bot is currently connected to a voice channel
        if (clientVoiceConnection) {
          clientVoiceConnection.channel.leave();
        }
      }

      // TODO: Get the bot to follow victims across different channels
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
