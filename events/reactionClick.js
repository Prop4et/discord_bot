const { Events } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { useQueue } = require('discord-player');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(interaction, user) {
        if (interaction.message.author.bot && interaction.message.embeds.length > 0) {
            const duration = 60000;
            
            // Check if the user who reacted is not a bot
            if (!user.bot && Date.now() - interaction.message.createdTimestamp < duration) {
                // Perform actions based on the interaction and user
                const queue =  useQueue(interaction.message.guildId);
                const tracks = queue.tracks.map((track, index, duration) => `${++index}. ${track.title} (${track.duration})`);
                
                let tracksq = '';

                if (interaction.emoji.name === '◀️' && interaction.client.currentslice > 0) {
                    interaction.client.currentslice -= 1;
                } else if (interaction.emoji.name === '▶️' && interaction.client.currentslice < interaction.client.slices-1) {
                    interaction.client.currentslice += 1;
                }

                let multIndex = interaction.client.currentslice*10;
                let tracklength = (tracks.length - multIndex) < 10 ? tracks.length - multIndex : 10;
                for(var i = multIndex; i<multIndex + tracklength; i++)
                    tracksq += `${tracks[i]}\n`;
                const embed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle(`▶️ Now Playing : ${queue.currentTrack.title}\n\n`)
                    .setFooter({text:  `Showing from track ${multIndex} to track ${multIndex + tracklength} of ${tracks.length} tracks`})
                    .setDescription(tracksq)

                multIndex+1 === multIndex+tracklength ?
                    embed.setFooter({text:  `Showing track ${multIndex+1} of ${tracks.length} tracks`}) : 
                    embed.setFooter({text:  `Showing from track ${multIndex+1} to track ${multIndex + tracklength} of ${tracks.length} tracks`});
                
                interaction.message.edit({embeds: [embed]})
                setTimeout(() => {
                    interaction.users.remove(user.id).catch(console.error);
                }, duration);
            }
        }
        
    }
}