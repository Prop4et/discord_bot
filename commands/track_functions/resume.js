const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('pauses the current track'),
	async execute(interaction) { 
        const queue =  useQueue(interaction.guild.id);
        var connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        if(!connection)
            return await interaction.reply({content: `❌ Not connected.`, ephemeral:true, allowedMentions: { repliedUser: false} });

        if(connection.joinConfig.channelId !== channel.id)
            return await interaction.reply({content: `❌ Wrong channel :/`, ephemeral:true, allowedMentions: { repliedUser: false} })
            
        if(!queue)
            return await interaction.reply({content: `❌ Nothing to resume, shithead.`, allowedMentions: { repliedUser: false }});
        
        const success = queue.node.resume();
        return success ? await interaction.reply('▶️ song resumed') : await interaction.reply({ content: `❌ Something went wrong.`, allowedMentions: { repliedUser: false } });

	},
};