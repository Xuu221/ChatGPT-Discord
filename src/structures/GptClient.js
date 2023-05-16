require('dotenv/config');
const { Client, Collection, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { readdirSync } = require("fs");
const { QuickDB } = require("quick.db");

class GPTBot extends Client {
    
	 constructor() {
        super({
            shards: "auto",
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ]
        });
     
        
     const db = new QuickDB();
	 this.commands = new Collection();
     this.aliases = new Collection();

     this.config = require("../config.js");
     this.owner = this.config.ownerID;
     this.prefix = this.config.prefix;  
     this.logs = this.config.logs;   
     this.logger = require("../utils/logger.js");
  
    /**
     * Error Handler
     */
    this.on("disconnect", () => console.log("Bot is disconnecting..."))
    this.on("reconnecting", () => console.log("Bot reconnecting..."))
    this.on('warn', error => console.log(error));
    this.on('error', error => console.log(error));
    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));
	
    const client = this;



    client.on('messageCreate', async (message) => {

        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) return;
        
        let prefix = await db.get(`${message.guild.id}.prefix`);
        let channelID = await db.get(`${message.guild.id}.gptchannelid`);

        if (message.content.startsWith('!') || message.content.startsWith(prefix)) return;
        
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
          });
          
          const openai = new OpenAIApi(configuration);  
    
        if (message.author.bot) return;
        if (!message.guild) return;
      
        if (!channelID || message.channel.id !== channelID) return;
      
      
        let conversationLog = [
          { role: 'system', content: 'Hello!.' },
        ];
      
        try {
          await message.channel.sendTyping();
          let prevMessages = await message.channel.messages.fetch({ limit: 20 });
          prevMessages.reverse();
          
          prevMessages.forEach((msg) => {
            if (message.content.startsWith('!')) return;
            if (msg.author.id !== client.user.id && message.author.bot) return;
            if (msg.author.id == client.user.id) {
              conversationLog.push({
                role: 'assistant',
                content: msg.content,
                name: msg.author.username
                  .replace(/\s+/g, '_')
                  .replace(/[^\w\s]/gi, ''),
              });
            }
      
            if (msg.author.id == message.author.id) {
              conversationLog.push({
                role: 'user',
                content: msg.content,
                name: message.author.username
                  .replace(/\s+/g, '_')
                  .replace(/[^\w\s]/gi, ''),
              });
            }
          });
      
          const result = await openai
            .createChatCompletion({
              model: 'gpt-3.5-turbo',
              messages: conversationLog,
              // max_tokens: 256, // limit token usage
            })
            .catch((error) => {
              console.log(`OPENAI ERR: ${error}`);
            });
      
          message.reply(result.data.choices[0].message);
      
        } catch (error) {
          console.log(`ERR: ${error}`);
        }
      });

    
/**
 * Client Events
 */
console.log("----------------------------------CLIENT EVENTS----------------------------------");
  let cv=0;
	readdirSync("./src/events/Client/").forEach(file => {
    const event = require(`../events/Client/${file}`);
    let eventName = file.split(".")[0];
    this.logger.log(`Loading Events Client ${eventName}`, "event");
    this.on(eventName, event.bind(null, this));
    cv++;
});
console.log("-->Loaded "+cv+" Client Events ");

/**
 * Import all commands
 */
console.log("----------------------------------COMMANDS----------------------------------");
let cmd=0;
  readdirSync("./src/commands/").forEach(dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${dir}/${file}`);
        this.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
        this.commands.set(command.name, command);
        cmd++;
    }
})
console.log("-->Loaded "+cmd+" Bot commands");


	 }
		connect() {
            return super.login(process.env.DISCORD_TOKEN);
        };
};

module.exports = GPTBot;