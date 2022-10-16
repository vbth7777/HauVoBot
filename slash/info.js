const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get info about song"),
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return interaction.editReply("There are no songs in the queue");
        }
        let bar = queue.createProgressBar({
            queue: false,
            length: 10,
        });
        const song = queue.current;
        const embed = new MessageEmbed()
            .setTitle("Song Info")
            .setDescription(
                `**Title:** ${song.title}\n**Duration:** ${song.duration}\n**Requested by:** ${song.requestedBy}\n**Views:** ${song.views}\n**URL:** ${song.url}` +
                    bar
            )
            .setColor("RANDOM");
        interaction.editReply({ embeds: [embed] });
    },
};
