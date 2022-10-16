const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show the queue")
        .addNumberOption((option) =>
            option
                .setName("page")
                .setDescription("The page to show")
                .setMinValue(0)
        ),
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return interaction.editReply("There are no songs in the queue");
        }
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getNumber("page") || 1) - 1;
        if (page > totalPages) {
            return await interaction.editReply(
                `The page must be between 1 and ${totalPages}`
            );
        }
        const queueString = queue.tracks
            .slice(page * 10, (page + 1) * 10)
            .map((track, index) => {
                return `${page * 10 + index + 1}. ${track.title} - ${
                    track.requestedBy.username
                }`;
            })
            .join("\n");
        const currentSong = queue.current;
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `**Current Song**: ${currentSong.title} - ${currentSong.requestedBy.username}\n\n**Queue**:\n${queueString}`
                    )
                    .setFooter(`Page ${page + 1} of ${totalPages}`)
                    .setThumbnail(currentSong.thumbnail),
            ],
        });
        // let embed = new MessageEmbed()
        //     .setTitle("Queue")
        //     .setColor("RANDOM")
        //     .setDescription(
        //         queue.songs
        //             .map((song, index) => {
        //                 return `${index + 1} - ${song.name}`;
        //             })
        //             .join("\n")
        //     );
        // interaction.editReply({ embeds: [embed] });
    },
};
