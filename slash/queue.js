const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Xem hàng đợi"),
    .addNumberOption((option) =>
      option.setName("page").setDescription("Trang").setMinValue(0)
    ),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getNumber("page") || 1) - 1;
    if (page > totalPages) {
      return await interaction.editReply(
        `Trang phải nằm trong phạm vi từ 1 tới ${totalPages}`
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
        new EmbedBuilder()
          .setDescription(
            `**Bài hát đang phát**: ${currentSong.title} - ${currentSong.requestedBy.username}\n\n**Hàng đợi**:\n${queueString}`
          )
          .setThumbnail(currentSong.thumbnail),
      ],
    });
    // let embed = new EmbedBuilder()
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
