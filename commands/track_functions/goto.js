const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
const { timeToSeconds } = require('../../utils/timeToSeconds');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('goto')
		.setDescription('goes to a specific time in the track')
        .addStringOption(option =>
            option
            .setName('time')
            .setDescription('goto <[hhmm]ss/[hh:mm]:ss> (ex: 3m20s, 1:20:55)')
            .setRequired(true)),
	async execute(interaction) { 
        await interaction.deferReply();

        var connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        if(!connection)
            return await interaction.editReply({content: `❌ Not connected.`, ephemeral:true, allowedMentions: { repliedUser: false} });

        if(connection.joinConfig.channelId !== channel.id)
            return await interaction.editReply({content: `❌ Wrong channel :/`, ephemeral:true, allowedMentions: { repliedUser: false} })
        
        const queue =  useQueue(interaction.guild.id);
        if(!queue || !queue.isPlaying())
            return await interaction.editReply({content: `❌ Nothing is playing right now donkey.`, allowedMentions: { repliedUser: false } });
        
        
        var timestamp = queue.node.getTimestamp();
        if(timestamp.progress == 'Infinity')
            return await interaction.editReply({content: `❌ Live streaming WTF`, ephemeral:true, allowedMentions: { repliedUser: false} })
        
        const track = queue.currentTrack;

        const str = interaction.options.getString('time');
        const targetTime = timeToSeconds(str);
        const duration = timeToSeconds(track.duration);

        if(!targetTime)
            return await interaction.editReply({content: `❌ Wrong time format`, ephemeral:true, allowedMentions: { repliedUser: false} })

        if(targetTime >= duration)
            return await interaction.editReply({content: `❌ Skip the whole song at this point`, ephemeral:true, allowedMentions: { repliedUser: false} })
        
        queue.node.pause();
        const success = await queue.node.seek(targetTime*1000);
        if(success){
            const progress = queue.node.createProgressBar();
            timestamp = queue.node.getTimestamp();
            const track = queue.currentTrack;
            const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription(`🕒 Song forwarded to ${str}`)
            .setFooter({text: `${progress} (**${timestamp.progress}**%)`})
            .setThumbnail(track.thumbnail);
            return await interaction.editReply({embeds: [embed]});
        }
        else{
            return await interaction.editReply({content: `❌ Something went wrong`, ephemeral:true, allowedMentions: { repliedUser: false} });
        }
	},
};