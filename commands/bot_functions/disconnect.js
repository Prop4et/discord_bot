const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useMasterPlayer, useQueue } = require('discord-player');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('disconnect the bot to the current channel'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        const channel = interaction.member.voice.channel;
		if(!connection)
            return await interaction.reply({content: `❌ | Not connected.`, ephemeral:true, allowedMentions: { repliedUser: false} });

        if(connection.joinConfig.channelId !== channel.id)
            return await interaction.reply({content: `❌ | Wrong channel :/`, ephemeral:true, allowedMentions: { repliedUser: false} })

		const queue = useQueue(interaction.guild.id);
		if (queue)
			queue.delete();
		await interaction.reply(`Disconnecting, Bye`);
	},
};