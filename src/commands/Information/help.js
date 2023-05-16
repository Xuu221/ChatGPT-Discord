const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const {readdirSync} = require("fs");
const db = require("quick.db");

module.exports = {
    name: "help",
    category: "Information",
    aliases: [ "h" ],
    description: "Xem danh sách và chi tiết lệnh",
    args: false,
    usage: "[command name]",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {

      const server = new ButtonBuilder()
      .setLabel("Support Server")
			.setEmoji('889965765057466418')
      .setURL(`https://discord.gg/UEAgEm8YFq`)
			.setStyle(ButtonStyle.Link);

		const invite = new ButtonBuilder()
      .setLabel("Invite Me")
      .setEmoji('926363015689945148')
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=84992&scope=bot`)
			.setStyle(ButtonStyle.Link);

		const row = new ActionRowBuilder()
			.addComponents(server, invite);

      const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${client.user.username} Commands`)  
      .setThumbnail(client.user.displayAvatarURL())
      if (!args[0]) {
        const categories = readdirSync('src/commands/');
        let commandsize = 0;
        categories.forEach(category => {
            const dir = client.commands.filter(c => c.category === category);
            commandsize += parseInt(dir.size);
            const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
            try {
              helpEmbed.addFields({ name: `❯ ${capitalise} - [${dir.size} lệnh]:`, value: dir.map(c => `  \`${c.name}\``).join(' ')})

            } catch(e) {
                console.log(e);
            }
        });
        helpEmbed
          .setFooter({ text: `Sử dụng ${prefix}help [tên lệnh] để xem chi tiết lệnh!`})
          .setDescription(`>>> Prefix : \`${prefix}\`\nTổng số lệnh: ${commandsize}`)
        return message.channel.send({ embeds: [helpEmbed], components: [row]});
    } else return getCMD(message, args, client, prefix);
      
    }
  }

  
  //Xem chi tiết lệnh hoặc danh sách lệnh
  function getCMD(message, args, client, prefix) {

    const command = client.commands.get(args[0].toLowerCase()) ||client.commands.find(
      (c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));    
     const c = `Không có lệnh \`${args[0]}\``
     
    if (!command) {
      const embed = new EmbedBuilder()
        .setDescription(`${c}\nSử dụng \`${prefix}help\` để xem danh sách lệnh!`)
        .setColor("Red");
        return message.channel.send({ embeds: [embed]});
    }
              const detailEmb = new EmbedBuilder() 
                  .setTitle(`Chi tiết lệnh:`)
                  .addFields({ name: 'Tên lệnh:', value: command.name ? `\`${command.name}\`` : `Không có!`})
                  .addFields({ name: 'Lệnh khác:', value: command.aliases ? `\`${command.aliases.join("` `")}\`` : `Không có!`})
                  .addFields({ name: 'Sử dụng:', value: command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``})
                  .addFields({ name: 'Mô tả:', value: command.description ? command.description : "Không có mô tả."})
                  .setFooter({ text: `<> - bắt buộc, [] - không bắt buộc`})
                  .setColor(0x0099FF);
              return message.channel.send({ embeds: [detailEmb]});
  }
  