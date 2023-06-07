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
        var connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        //console.log(connection.channel.id, channel.id)
        //player.queue.node.pause();
        const queue = player.nodes.get(interaction.guild.id);
        queue.node.resume();
        await interaction.reply(`Pausing`);
	},
};