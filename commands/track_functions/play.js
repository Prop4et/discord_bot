const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus , createAudioResource } = require('@discordjs/voice');
const { useMasterPlayer } = require('discord-player');
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
            //REMOVE COMMENTS TO MAKE IT WORK PROPERLY
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
      
        const queue = player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user,
            },
            selfDeaf: true,
            volume: 80,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000,
        });

        try {
            if (!queue.connection)
                await queue.connect(interaction.member.voice.channel);
        } catch (error) {
            console.log(error);
            if (!queue?.deleted) queue?.delete();
            return interaction.editReply({ content: `❌ | I can't join audio channel.`, allowedMentions: { repliedUser: false } });
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
                    return interaction.editReply({ content: `❌ | I can't play this track.`, allowedMentions: { repliedUser: false } });
                });
        }
        
        await interaction.editReply({embeds: [embed]});
	},
};