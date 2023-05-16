const {EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
module.exports = {
    name: "channel",
    category: "Config",
    description: "Thay đổi Channel cho Chat GPT",
    args: false,
    usage: "<id channel mới>",
    aliases: ["setchannel"],
    permission: [],
    owner: false,

  execute: async (message, args, client) => {
      
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply("Bạn cần quyền `MANAGE GUILD (Quản lý phòng)` để sử dụng lệnh này.");


    if (!args[0]) {
      const embed = new EmbedBuilder()
          .setDescription(`Nhập Channel ID mà bạn muốn đặt cho Chat GPT!`)
          .setColor("Red");
        return message.channel.send({ embeds: [embed] });
      }

    if (isNaN(args[0])) {
    const embed = new EmbedBuilder()
        .setDescription(`❌ Bạn phải nhập đúng Channel ID ❌`)
        .setColor("Red");
      return message.channel.send({ embeds: [embed] });
    }
    const channelID = client.channels.cache.get(args[0]);
    if (!channelID || channelID.type !== 0) {
      const embed = new EmbedBuilder()
       .setDescription(`❌ Channel không tồn tại hoặc không phải Channel Text ❌`)
       .setColor("Red")
     return message.channel.send({ embeds: [embed] });
   }

      let GPTChannelID = args[0];
      const db = new QuickDB();
      await db.set(`${message.guild.id}.gptchannelid`,`${GPTChannelID}`);

      let send = new EmbedBuilder()
          .setDescription(`✅ Đã cài đặt Channel cho bot hoạt động là: <#${GPTChannelID}> ✅`)
          .setTimestamp()
          .setColor("Green")
          .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}` });
         return message.channel.send({embeds: [send]});
        
   }
}
