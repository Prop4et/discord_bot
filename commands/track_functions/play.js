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
        
        res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
        
        //TODO: change print for playlist
        let song = res.tracks[0];
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(song.title)
            .setURL(song.url)
            .setDescription(`Added **[${song.title}](${song.author})** to the queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: song.duration});
        
        if (!queue.isPlaying()) {
            await queue.node.play()
                .catch((error) => {
                    console.log(error);
                    return interaction.reply({ content: `❌ | I can't play this track.`, allowedMentions: { repliedUser: false } });
                });
        }
        
        await interaction.editReply({embeds: [embed]});
	},
};