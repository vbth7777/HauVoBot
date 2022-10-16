const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Tiếp tục phát nhạc"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    const success = queue.setPaused(false);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Đã tiếp tục phát nhạc`),
      ],
    });
  },
};
