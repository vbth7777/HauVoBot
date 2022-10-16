const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Thay đổi âm lượng")
    .addIntegerOption((option) =>
      option.setName("volume").setDescription("Âm lượng")
    ),
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
    const volume = interaction.options.getInteger("volume");
    if (volume < 0 || volume > 100) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription("Vui lòng nhập một con số từ 0 đến 100"),
        ],
      });
    }
    const success = queue.setVolume(volume);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Âm lượng đã được đặt thành ${volume}`),
      ],
    });
  },
};
