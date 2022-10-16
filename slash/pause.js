const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the current song"),
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return interaction.editReply("There are no songs in the queue");
        }
        const success = queue.setPaused(true);
        return interaction.editReply(
            success
                ? "Paused the song (use /resume to resume the song)"
                : "Something went wrong"
        );
    },
};
