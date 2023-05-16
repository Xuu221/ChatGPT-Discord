const { EmbedBuilder, version: djversion } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os');
const { version } = require('../../../package.json');
const system = require('systeminformation');

module.exports = {
    name: "botinfo",
    category: "Information",
    description: "Thông tin về bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
        const duration1 = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const cpu = await system.cpu();
       
        let totalGuilds = client.guilds.cache.size;
        let totalMembers=0;
        client.guilds.cache.forEach((guild) => {
            totalMembers += guild.memberCount 
        })
        let ccount = client.channels.cache.size;
        let cuser = client.users.cache.filter(user => !user.bot).size;
        


        const embed = new EmbedBuilder()       
            .setColor("Green")
            .setThumbnail(message.client.user.displayAvatarURL({dynamic: true}))
            if(message.author.id === client.owner) {
                embed.setDescription(`**🔎 INFORMATION**
**- Username** : ${client.user.tag}
**- ID** : ${client.user.id}
**- Version** : v${version}
**- Servers** : ${totalGuilds}
**- Channels** : ${ccount}
**- Guild Member** : ${totalMembers}
**- User** : ${cuser}

**🔰 SYSTEM**
**- Discord.js** : v${djversion}
**- Node.js** : ${process.version}
**- Platfrom** : ${os.type}

**🖥️ CPU**
**- Cores** : ${cpu.cores}
**- Model** : ${os.cpus()[0].model} 
**- Speed** : ${os.cpus()[0].speed} MHz

**📝 MEMORY**
**- Total Memory** : ${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps
**- Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(2)} Mbps
**- Heap Total** : ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} Mbps
**- Heap Usage** : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mbps

**⏲️ UPTIME** : ${duration1}
`);
            }else{
                embed.setDescription(`**🔎 INFORMATION**
**- Username** : ${client.user.tag}
**- ID** : ${client.user.id}
**- Version** : v${version}
**- Servers** : ${totalGuilds}
**- Channels** : ${ccount}
**- Guild Member** : ${totalMembers}
**- User** : ${cuser}

**🔰 SYSTEM**
**- Discord.js** : v${djversion}
**- Node.js** : ${process.version}
**- Platfrom** : ${os.type}

**⏲️ UPTIME** : ${duration1}
`);
            }
            
         message.channel.send({embeds: [embed]});
    }
}



