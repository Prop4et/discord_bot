const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
const { QueryType } = require('discord-player');
var flag = true;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pauses the current track'),
	async execute(interaction) { 
        var connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        if(!connection)
            return await interaction.reply({content: `❌ Not connected.`, ephemeral:true, allowedMentions: { repliedUser: false} });

        if(connection.joinConfig.channelId !== channel.id)
            return await interaction.reply({content: `❌ Wrong channel :/`, ephemeral:true, allowedMentions: { repliedUser: false} })
        
        const queue =  useQueue(interaction.guild.id);
        if(!queue || !queue.isPlaying())
            return await interaction.reply({content: `❌ Nothing is playing right now donkey.`, allowedMentions: { repliedUser: false } });
        
        const success = queue.node.pause();
        return success ? await interaction.reply('⏸️ song paused') : await interaction.reply({ content: `❌ Something went wrong.`, allowedMentions: { repliedUser: false } });
	},
};