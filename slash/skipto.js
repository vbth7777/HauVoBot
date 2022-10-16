const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Bỏ qua bài hát với số lần bỏ qua")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Số thứ tự trong hàng đợi (Số lần bỏ qua bài hát)")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    const number = interaction.options.getInteger("number");
    const success = queue.jump(number);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Đã bỏ qua ${number} bài hát`),
      ],
    });
  },
};
