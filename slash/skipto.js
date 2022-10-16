const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skip to a specific song in the queue")
        .addIntegerOption((option) =>
            option
                .setName("number")
                .setDescription("The number of the song in the queue")
                .setRequired(true)
        ),
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return interaction.editReply("There are no songs in the queue");
        }
        const number = interaction.options.getInteger("number");
        const success = queue.jump(number);
        return interaction.editReply(
            success ? `Skipped to the song` : "Something went wrong"
        );
    },
};
