const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus , createAudioResource } = require('@discordjs/voice');
const { useMasterPlayer } = require('discord-player');
const { QueryType } = require('discord-player');
var flag = true;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('pauses the current track'),
	async execute(interaction) { 
        const player = useMasterPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        if(!queue)
            return await interaction.reply({content: `❌ | Nothing to resume, shithead.`, allowedMentions: { repliedUser: false }});
        
        const success = queue.node.resume();
        return success ? await interaction.reply('▶️ | song resumed') : await interaction.reply({ content: `❌ | Something went wrong.`, allowedMentions: { repliedUser: false } });

	},
};