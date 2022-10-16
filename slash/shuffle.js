const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Xáo trộn hàng đợi"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    queue.shuffle();
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Đã xáo trộn hàng đợi`),
      ],
    });
  },
};
