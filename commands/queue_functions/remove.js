const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Removes a song form the queue given the index')
        .addIntegerOption(option =>
            option
                .setName('pos')
                .setDescription('position in the queue')
                .setMinValue(0)
                .setRequired(true)),
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
        
        let tracks = queue.tracks.map((track) => `${track.title}`);

        if (tracks.length < 1)
            return interaction.reply({ content: `❌ No music in queue after current.`, allowedMentions: { repliedUser: false } });

        const pos = interaction.options.getInteger('pos')-1;
        if (pos >= tracks.length)
            return interaction.reply({ content: `❌ List out of bounds.`, allowedMentions: { repliedUser: false } });

        queue.node.remove(pos);
        interaction.client.slices = queue.size/10;
        await interaction.reply(`🗑️ ${tracks[pos]} removed`);
	},
};
