const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    description: "Xem Ping của Bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {

  
  await message.channel.send({ content: "🏓Pinging..." }).then(async (msg) => {
  const ping = msg.createdTimestamp - message.createdTimestamp;
  const api_ping = client.ws.ping;

    const PingEmbed = new EmbedBuilder()
          .setColor("Green")
          .setThumbnail(`${client.user.displayAvatarURL({dynamic: true})}`)
          .addFields({ name: '⏳ Latency', value: `\`\`\`cpp\n ${ping}ms\n\`\`\``, inline: false })
          .addFields({ name: "💓 API", value: `\`\`\`cpp\n ${api_ping}ms \n\`\`\``, inline: false })
          .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}` })
        .setTimestamp();
    setTimeout(() => { msg.edit({ content: null, embeds: [PingEmbed] }); }, 1000);
  })
 }
}