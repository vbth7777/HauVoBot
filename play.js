const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Phát nhạc từ Youtube")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Phát một bài hát từ Youtube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Đường dẫn từ Youtube")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Phát danh sách phát từ Youtube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Đường dẫn từ Youtube")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Tìm kiếm bài hát từ Youtube và chọn kết quả đầu tiên")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Nội dung tìm kiếm")
            .setRequired(true)
        )
    ),
  run: async (client, interaction) => {
    if (!interaction.member.voice.channel) {
      return interaction.editReply(
        "Bạn phải ở trong phòng thoại để sử dụng được lệnh này!"
      );
    }
    const queue = await client.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("Không có kết quả nào được tìm thấy!");
      }
      const song = result.tracks[0];
      await queue.play(song);
      embed
        .setDescription(`Bài hát ${song.title} đã được thêm vào hàng đợi!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: "Thời gian: " + song.duration });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("Không có kết quả nào được tìm thấy!");
      }
      const playlist = result.playlist;
      await queue.addTracks(playlist.tracks);
      embed.setDescription(
        `Danh sách ${playlist.title} (${result.tracks.length} bài hát) đã được thêm vào hàng đợi!`
      );
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("Không có kết quả nào được tìm thấy!");
      }
      const song = result.tracks[0];
      await queue.play(song);
      embed
        .setDescription(`Bài hát ${playlist.title} đã được thêm vào hàng đợi!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: "Thời gian: " + song.duration });
    }
    if (!queue.playing) await queue.play();
    return interaction.editReply({ embeds: [embed] });
  },
};
