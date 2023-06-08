const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
const { timeToSeconds } = require('../../utils/timeToSeconds');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('forward')
		.setDescription('forwards the song of a number of seconds')
        .addIntegerOption(option =>
            option
                .setName('time')
                .setDescription('the amount of seconds to ffw')
                .setMinValue(0)
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
        
        const time = interaction.options.getInteger('time');
        const track = queue.currentTrack;
        const duration = timeToSeconds(track.duration);
        const current = timeToSeconds(timestamp.current.label);
        const ffw = current+time;
        if(duration <= ffw)
            return await interaction.editReply({content: `❌ Skip the whole song at this point`, ephemeral:true, allowedMentions: { repliedUser: false} })
        
        const success = await queue.node.seek(ffw*1000);
        if(success){
            const progress = queue.node.createProgressBar();
            timestamp = queue.node.getTimestamp();
            const track = queue.currentTrack;
            const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription(`⏩ Song forwarded by ${time} seconds`)
            .setFooter({text: `${progress} (**${timestamp.progress}**%)`})
            .setThumbnail(track.thumbnail);
            return await interaction.editReply({embeds: [embed]});
        }
        else{
            return await interaction.editReply({content: `❌ Something went wrong`, ephemeral:true, allowedMentions: { repliedUser: false} });
        }
	},
};