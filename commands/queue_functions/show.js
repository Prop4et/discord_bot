const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('show')
		.setDescription('lists the first 10 songs in the queue'),
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
        
        const tracks = queue.tracks.map((track, index, duration) => `${++index}. ${track.title} (${track.duration})`);
        let nowplaying = `▶️ Now Playing : ${queue.currentTrack.title}\n\n`;

        let tracksq = '';
        let tracklength = tracks.length < 10 ? tracks.length : 10;
       
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(nowplaying)
            .setFooter({text:  `Showing from track 1 to track ${tracklength} of ${tracks.length} tracks`})

        tracklength == 1 ?
            embed.setFooter({text:  `Showing track 1 of ${tracks.length} tracks`}) : 
            embed.setFooter({text:  `Showing from track 1 to track ${tracklength} of ${tracks.length} tracks`})


        for(var i = 0; i<tracklength; i++)
            tracksq += `${tracks[i]}\n`;
        if(tracklength < 1)
            tracksq = '---------------------------';    
        embed.setDescription(tracksq)


        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        if(tracks.length > 10){
            await message.react('◀️');
            await message.react('▶️');
        }
	},
};