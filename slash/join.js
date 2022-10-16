const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { color } = require("../core/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Tham gia kênh thoại"),
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
    await queue.connect(interaction.member.voice.channel);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`Đã tham gia kênh thoại của bạn`),
      ],
    });
  },
};
