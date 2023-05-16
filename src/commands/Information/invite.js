const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "invite",
  category: "Information",
  aliases: [ "add" ],
  description: "Link mời bot",
  args: false,
  usage: "",
  permission: [],
  owner: false,
 execute: async (message, args, client, prefix) => {
       
    
        const mainPage = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({ name: `${client.user.username}` })
          //.setDescription(`[Click Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&PermissionsBitField=36785216&scope=bot%20applications.commands)`)
          .setThumbnail(`${client.user.displayAvatarURL({dynamic: true})}`)
          .addFields({ name: '❯ Invite Me', value: `[Click Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=84992&scope=bot)`, inline: false })
          .addFields({ name: '❯ Support Server', value: `[Click Here](https://discord.gg/UEAgEm8YFq)`, inline: false })
          .setFooter({ text: `Thank you for using ${client.user.username}!`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}` });
          
         message.channel.send({embeds: [mainPage]})
  }
}