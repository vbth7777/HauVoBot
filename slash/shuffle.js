const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the queue"),
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return interaction.editReply("There are no songs in the queue");
        }
        queue.shuffle();
        await interaction.editReply(
            `Shuffled the queue of ${queue.tracks.length} songs}`
        );
    },
};
