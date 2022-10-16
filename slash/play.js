const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { color } = require("../core/config.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Phát nhạc từ Youtube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Tìm kiếm bài hát hoặc đường dẫn")
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    if (!interaction.member.voice.channel) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription("Bạn phải ở trong kênh thoại để sử dụng lệnh này"),
        ],
      });
    }
    const queue = await client.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder().setColor(color);

    if (interaction.options.getString("query").includes("youtube.com/watch")) {
      let query = interaction.options.getString("query");
      const result = await client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setDescription("Không có kết quả nào được tìm thấy!"),
          ],
        });
      }
      const song = result.tracks[0];
      await queue.play(song);
      embed
        .setDescription(`${song.title} đã được thêm vào hàng đợi!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: "Thời gian: " + song.duration });
    } else if (
      interaction.options.getString("query").includes("youtube.com/playlist")
    ) {
      let query = interaction.options.getString("query");
      const result = await client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setDescription("Không có kết quả nào được tìm thấy!"),
          ],
        });
      }
      const playlist = result.playlist;
      await queue.addTracks(playlist.tracks);
      embed.setDescription(
        `Danh sách ${playlist.title} (${result.tracks.length} bài hát) đã được thêm vào hàng đợi!`
      );
    } else if (!interaction.options.getString("query").match(/^https?\:/)) {
      let query = interaction.options.getString("query");
      const result = await client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setDescription("Không có kết quả nào được tìm thấy!"),
          ],
        });
      }
      const song = result.tracks[0];
      await queue.play(song);
      embed
        .setDescription(`${song.title} đã được thêm vào hàng đợi!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: "Thời gian: " + song.duration });
    }
    if (!queue.playing) await queue.play();
    return interaction.editReply({ embeds: [embed] });
  },
};
