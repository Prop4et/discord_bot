const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useMasterPlayer, useQueue } = require('discord-player');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('disconnect the bot to the current channel'),
	async execute(interaction) {
        const player = useMasterPlayer();
		const queue = useQueue(interaction.guild.id);
		queue.delete();
		console.log(queue)
        const connection = getVoiceConnection(interaction.guild.id);
		if(connection){//e canale connesso è lo stesso dell'utente
        	connection.destroy();
			await interaction.reply(`Disconnecting, Bye`);
		}
		else{
			await interaction.reply(`I'm not connected u dumbass`);
		}
	},
};