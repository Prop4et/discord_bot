const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('sets the volume to the given number')
        .addIntegerOption(option =>
            option
                .setName('volume')
                .setDescription('volume value')
                .setMinValue(1)
                .setMaxValue(100)
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
            return await interaction.reply({content: `❌ No volume can be set.`, allowedMentions: { repliedUser: false } });
        
        const volume = interaction.options.getInteger('volume');

        const success = queue.node.setVolume(volume);
        return success ? await interaction.reply(`🔉 volume set to ${volume}%`) : await interaction.reply({ content: `❌ Something went wrong.`, allowedMentions: { repliedUser: false } });
	},
};