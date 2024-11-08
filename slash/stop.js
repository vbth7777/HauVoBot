const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Dừng phát nhạc và xóa hàng đợi"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription("Không có bài hát nào trong hàng đợi"),
        ],
      });
    }
    queue.destroy();
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Đã dừng phát nhạc và xóa hàng đợi`),
      ],
    });
  },
};
