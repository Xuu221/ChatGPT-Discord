const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require('fs');
const moment = require("moment");
const { QuickDB } = require("quick.db");

module.exports = async (client, message) => {

    const db = new QuickDB();
   if (message.author.bot) return;
   if (!message.guild) return;
    let prefix;
    let getprefix = await db.get(`${message.guild.id}.prefix`);


    if (getprefix === null || !getprefix){
        prefix = client.prefix;
    }else{
        prefix = getprefix;
    }
    
    /** Kiểm tra quyền xem channel và gởi tin nhắn*/
    if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.ViewChannel)) return;
    //if(!message.guild.members.me.permissions.has(PermissionFlagsBits.ViewChannel)) return;
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return await message.author.send({ content: `Bot không có quyền \`SEND MESSAGES (Gởi tin nhắn)\` trong kênh <#${message.channelId}>` }).catch(() => {});
   
    /** */
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`**› Prefix: \`${prefix}\`**\n**› Cách dùng: \`${prefix}help\`** để xem danh sách lệnh!`);
      message.channel.send({embeds: [embed]})
    };
    /** */
    
   const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [ matchedPrefix ] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    //ghi lại lịch sử cmd
    const date = `${moment().utcOffset('+07:00').format("DD-MM-YYYY hh:mm:ss A")}`;
    const a = `[${date}]: [ ${commandName} ] used by ${message.author.tag}(${message.author.id}) from ${message.guild.name}(${message.guild.id})\n`;
    fs.appendFile('text/cmdLog.txt', a, (err) => {
        if (err) throw err;
    });
    //
    
    /** Kiểm tra quyền xem lịch sử tin nhắn và gởi embed*/
    let p1=0;p2=0;

    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) p1=1;//return await message.channel.send({ content: `Không thể thực hiện yêu cầu. Vui lòng bật quyền \`READ MESSAGE HISTORY(Xem lịch sử tin nhắn)\`` }).catch(() => {});

    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) p2=1;//return await message.channel.send({ content: `Bot không có quyền **\`EMBED LINKS (Nhúng liên kết)\`** để thực thi lệnh **\`${command.name}\`**.` }).catch(() => {});
    if(p1==1||p2==1){
        const pp1 = (p1==1?"❌":"✅") +" - "+ `READ MESSAGE HISTORY(Xem lịch sử tin nhắn)`;
        const pp2 = (p2==1?"❌":"✅") +" - "+ `EMBED LINKS (Nhúng liên kết)`;
        return message.channel.send(`\`\`\`Thiếu quyền: \n${pp1}\n${pp2}\`\`\``);
    }

    if (!command) return;
    
    const embed = new EmbedBuilder()
        .setColor("#ED1616");
    if (command.permission && !message.guild.members.me.permissions.has(command.permission)) {
        embed.setDescription("Bạn không thể sử dụng lệnh này.");
        return message.channel.send({embeds: [embed]});
    }   
   

    try {
        command.execute(message, args, client, prefix);
    } catch (error) {
        console.log(error);
        embed.setDescription(`❌ | Đã xảy ra lỗi khi thực hiện lệnh này!`);
        return message.channel.send({embeds: [embed]});
    }
  }
