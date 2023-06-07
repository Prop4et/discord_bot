const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect')
		.setDescription('Connects the bot to the current channel'),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		await interaction.reply(`Hi, I'm waiting for a song to play!`);
	},
};