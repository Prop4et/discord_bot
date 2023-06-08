const fs = require('node:fs')
const path = require('node:path')
const { Queue } = require('./queue')
// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection, Options } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const { token } = require('./config.json');
const { Player } = require('discord-player');
const { YouTubeExtractor } = require("@discord-player/extractor");
const cst = require(`${__dirname}/utils/constants`);
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });


client.commands = new Collection();
/*client.player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    }
});*/
const player = new Player(client, {
    ytdlOptions: cst.ytdlOptions
});

client.config = cst.config;

player.extractors.register(YouTubeExtractor);

player.events.on('disconnect', (queue) => {
    if (queue)
        queue.delete();
    console.log('disconnected')
});

player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`Started playing **${track.title}**`);
});

player.events.on('playerPause', (queue, track) => {
    //queue.metadata.channel.send(`paused **${track.title}**!`);
});

player.events.on('playerResume', (queue, track) => {
    //queue.metadata.channel.send(`resumed **${track.title}**!`);
});

player.events.on('playerSkip', (queue, track) => {
    //queue.metadata.channel.send(`skipped **${track.title}**!`);
});

player.events.on('emptyChannel', (queue, track) => {
    console.log('empty channel')
});


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
    
        if ('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }else{
            console.log(`[WARNING] The command at ${filePath} is missing a require "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);