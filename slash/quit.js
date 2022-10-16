const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the bot and clear the queue"),
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return interaction.editReply("There are no songs in the queue");
        }
        queue.destroy();
        await interaction.editReply("Stopped the bot and clear the queue");
    },
};
