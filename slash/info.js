const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playing")
    .setDescription("Lấy thông tin bài hát đang phát"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào đang phát");
    }
    let bar = queue.createProgressBar({
      queue: false,
      length: 10,
    });
    const song = queue.current;
    const embed = new EmbedBuilder()
      .setTitle("Thông tin bài hát đang phát")
      .setThumbnail(song.thumbnail)
      .setDescription(
        `**Tên bài hát:** ${song.title}\n**Thời gian:** ${song.duration}\n**Yêu cầu bởi:** ${song.requestedBy}\n**URL:** ${song.url}\n**Tiến trình:** \n${bar}`
      );
    interaction.editReply({ embeds: [embed] });
  },
};
