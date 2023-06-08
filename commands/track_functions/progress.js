const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('progress')
		.setDescription('shows the current time of the song'),
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
        
        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();
        const track = queue.currentTrack;
        if(timestamp.progress == 'Infinity')
            return await interaction.reply({content: `❌ Live streaming WTF`, ephemeral:true, allowedMentions: { repliedUser: false} })

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription(`${progress} (**${timestamp.progress}**%)`)
            .setThumbnail(track.thumbnail)

        await interaction.reply({embeds: [embed]});
	},
};