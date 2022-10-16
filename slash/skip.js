const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Bỏ qua bài hát hiện tại"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    const success = queue.skip();
    return interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`Đã bỏ qua bài hát`)],
    });
  },
};
