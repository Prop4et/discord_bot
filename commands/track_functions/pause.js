const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus , createAudioResource } = require('@discordjs/voice');
const { useMasterPlayer } = require('discord-player');
const { QueryType } = require('discord-player');
var flag = true;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pauses the current track'),
	async execute(interaction) { 
        const player = useMasterPlayer();
        const queue = player.nodes.get(interaction.guild.id);
        if(!queue || !queue.isPlaying())
            return await interaction.reply({content: `❌ | Nothing is playing right now donkey.`, allowedMentions: { repliedUser: false } });
        
        const success = queue.node.pause();
        return success ? await interaction.reply('⏸️ | song paused') : await interaction.reply({ content: `❌ | Something went wrong.`, allowedMentions: { repliedUser: false } });
	},
};