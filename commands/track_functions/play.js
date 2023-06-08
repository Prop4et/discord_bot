const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus , createAudioResource } = require('@discordjs/voice');
const { useMasterPlayer, useQueue } = require('discord-player');
const { QueryType } = require('discord-player');
var flag = true;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Adds a track or a playlist to the queue and reproduces it')
        .addSubcommand(subcommand =>
            subcommand
            .setName('song')
            .setDescription('plays a song')
            .addStringOption(option =>
                option
                .setName('title')
                .setDescription('The track to reproduce')
                .setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
            .setName('playlist')
            .setDescription('adds a playlist to the queue')
            .addStringOption(option =>
                option
                .setName('url')
                .setDescription('The link to the playlist to reproduce')
                .setRequired(true))
            ),
	async execute(interaction) { 
        await interaction.deferReply();
        const player = useMasterPlayer();
        var connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        if(!connection){
            if(!channel){
                await interaction.editReply(`You need to be in a voice channel`);
                return;
            }
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
        }

        var queue = useQueue(interaction.guild.id);
        if(!queue){
            queue = player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
                selfDeaf: interaction.client.config.deaf,
                volume: interaction.client.config.defaultVolume,
                leaveOnEmpty: interaction.client.config.autoLeave,
                leaveOnEmptyCooldown: interaction.client.config.autoLeaveCD,
                leaveOnEnd: interaction.client.config.autoLeave,
                leaveOnEndCooldown: interaction.client.config.autoLeaveCD,
                leaveOnStop: interaction.client.config.autoLeave,
                leaveOnStopCooldown: interaction.client.config.autoLeaveCD,
                skipOnNoStream: interaction.client.config.autoLeave,
                connectionTimeout: 999_999_999
            });
        }
        
        if(connection.joinConfig.channelId !== channel.id && (!queue.isEmpty() || queue.isPlaying()))
            return await interaction.editReply({content: `❌ Bot already in use in another channel :/`, ephemeral:true, allowedMentions: { repliedUser: false} })

        if(connection.joinConfig.channelId !== channel.id && (queue.isEmpty() && !queue.isPlaying())){
            queue.delete();
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            queue = player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
                selfDeaf: interaction.client.config.deaf,
                volume: interaction.client.config.defaultVolume,
                leaveOnEmpty: interaction.client.config.autoLeave,
                leaveOnEmptyCooldown: interaction.client.config.autoLeaveCD,
                leaveOnEnd: interaction.client.config.autoLeave,
                leaveOnEndCooldown: interaction.client.config.autoLeaveCD,
                leaveOnStop: interaction.client.config.autoLeave,
                leaveOnStopCooldown: interaction.client.config.autoLeaveCD,
                skipOnNoStream: interaction.client.config.autoLeave,
                connectionTimeout: 999_999_999
            });
        }

        var res;
        if(interaction.options.getSubcommand() === 'song'){
            const track = interaction.options.getString('title');
            res = await player.search(track, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            });

            if(!res || !res.tracks.length) return interaction.editReply({ content: `No results found ${interaction.member}... try again ? ❌`, ephemeral: true });

        }

        if(interaction.options.getSubcommand() === 'playlist'){
            const track = interaction.options.getString('url');
            res = await player.search(track, {
                requestedBy: interaction.member,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            });
            
            if(!res || !res.tracks.length) return interaction.editReply({ content: `No results found ${interaction.member}... try again ? ❌`, ephemeral: true });
        }
      
        

        try {
            if (!queue.connection)
                await queue.connect(interaction.member.voice.channel);
        } catch (error) {
            console.log(error);
            if (!queue?.deleted) queue?.delete();
            return interaction.editReply({ content: `❌ I can't join audio channel.`, allowedMentions: { repliedUser: false } });
        }
        var descriptionStr = "";
        var title;
        var url;
        var thumbnail;
        if (res.playlist){
            queue.addTrack(res.tracks);
            for(var i = 0; i<res.tracks.length; i++){
                descriptionStr += `Added **[${res.tracks[i].title}](${res.tracks[i].author})** to the queue\n`
                title = res.playlist.title;
                url = res.playlist.url;
                console.log(res.playlist.thumbnail);
                thumbnail = res.playlist.thumbnail.url;
            }
            console.log(res.thumbnail);
        }else{
            queue.addTrack(res.tracks[0]);
            descriptionStr += `Added **[${res.tracks[0].title}](${res.tracks[0].author})** to the queue`
            title = res.tracks[0].title;
            url = res.tracks[0].url;
            thumbnail = res.tracks[0].thumbnail;
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(title)
            .setURL(url)
            .setDescription(descriptionStr)
            .setThumbnail(thumbnail)
        if (!res.playlist) 
            embed.setFooter({text: res.tracks[0].duration});
        
        if (!queue.isPlaying()) {
            await queue.node.play()
                .catch((error) => {
                    console.error(error);
                    return interaction.editReply({ content: `❌ I can't play this track.`, allowedMentions: { repliedUser: false } });
                });
        }
        
        await interaction.editReply({embeds: [embed]});
	},
};