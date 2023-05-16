const {EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
module.exports = {
    name: "prefix",
    category: "Config",
    description: "Thay đổi Prefix",
    args: false,
    usage: "<prefix mới>",
    aliases: ["setprefix"],
    permission: [],
    owner: false,

  execute: async (message, args, client) => {
      
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply("Bạn cần quyền `MANAGE GUILD (Quản lý phòng)` để sử dụng lệnh này.");

    if (!args[0]) {
    const embed = new EmbedBuilder()
        .setDescription(`Nhập Prefix mà bạn muốn thay đổi!`)
        .setColor("Red");
      return message.channel.send({ embeds: [embed] });
    }

    if (args[1]) {
      const embed = new EmbedBuilder()
       .setDescription(`❌ Không thể đổi Prefix. Vui lòng thử lại! ❌`)
       .setColor("Red")
     return message.channel.send({ embeds: [embed] });
   }

    if (args[0].length > 5) {
    const embed = new EmbedBuilder()
        .setDescription(`❌ Prefix không được quá 5 kí tự! ❌`)
        .setColor("Red");
    return message.channel.send({ embeds: [embed] });
    }

      let newprefix = args.join(" ");
      const db = new QuickDB();
      await db.set(`${message.guild.id}.prefix`,`${newprefix}`);

      let send = new EmbedBuilder()
          .setDescription(`Prefix mới của Server là: \`${newprefix}\``)
          .setTimestamp()
          .setColor("Green")
          .setFooter({ text: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}` });
         return message.channel.send({embeds: [send]});
        
   }
}
