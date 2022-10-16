const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play songs from youtube")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Play a single song from a url")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The url of the song")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Play a playlist from a url")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The url of the playlist")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a song and play it")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("The query to search for")
            .setRequired(true)
        )
    ),
  run: async (client, interaction) => {
    if (!interaction.member.voice.channel) {
      return interaction.editReply(
        "You must be in a voice channel to use this command!"
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
        return interaction.editReply("No results found");
      }
      const song = result.tracks[0];
      await queue.play(song);
      embed
        .setDescription(`Song ${song.title} has been added to the queue!`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: "Duration " + song.duration });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("No results found");
      }
      const playlist = result.playlist;
      await queue.addTracks(playlist.tracks);
      embed.setDescription(
        `Playlist ${playlist.title} (${result.tracks.length} songs) have been added to the queue!`
      );
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("No results found");
      }
      const song = result.tracks[0];
      await queue.play(song);
      embed
        .setDescription(
          `Playlist ${playlist.title} (${result.tracks.length} songs) have been added to the queue!`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: "Duration: " + song.duration });
    }
    if (!queue.playing) await queue.play();
    return interaction.editReply({ embeds: [embed] });
  },
};
