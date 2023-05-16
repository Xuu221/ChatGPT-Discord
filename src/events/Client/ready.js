
module.exports = async (client) => {

    const channel = client.channels.cache.get(client.logs);
    channel.send(`${client.user.username} online!`);
    client.logger.log(`${client.user.username} online!`, "ready");


    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];
    Promise.all(promises)
	.then(results => {
		const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
		const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
		client.logger.log(`Server count: ${totalGuilds} --- Member count: ${totalMembers}`, "ready");
	})
	.catch(console.error);

    //Game
    client.user.setPresence({ activities: [{ name: `${client.prefix}help | @${client.user.tag} help` }] });

}