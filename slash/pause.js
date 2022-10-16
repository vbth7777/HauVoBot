const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Tạm dừng bài hát"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    const success = queue.setPaused(true);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Đã tạm dừng bài hát`),
      ],
    });
  },
};
