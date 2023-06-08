const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('shuffles the element inside the queue'),
	async execute(interaction) { 
        var connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        if(!connection)
            return await interaction.reply({content: `❌ Not connected.`, ephemeral:true, allowedMentions: { repliedUser: false} });

        if(connection.joinConfig.channelId !== channel.id)
            return await interaction.reply({content: `❌ Wrong channel :/`, ephemeral:true, allowedMentions: { repliedUser: false} })
        
        const queue =  useQueue(interaction.guild.id);
        if(!queue)
            return await interaction.reply({content: `❌ Nothing is playing right now donkey.`, allowedMentions: { repliedUser: false } });
        
        queue.tracks.shuffle();
        
        await interaction.reply(`🔀 Queue shuffled`);
        
	},
};