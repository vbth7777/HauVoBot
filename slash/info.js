const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playing")
    .setDescription("Get info about song"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("There are no songs in the queue");
    }
    let bar = queue.createProgressBar({
      queue: false,
      length: 10,
    });
    const song = queue.current;
    const embed = new EmbedBuilder()
      .setTitle("Song Info")
      .setThumbnail(song.thumbnail)
      .setDescription(
        `**Title:** ${song.title}\n**Duration:** ${song.duration}\n**Requested by:** ${song.requestedBy}\n**URL:** ${song.url}\n**Progress:** ${bar}`
      );
    interaction.editReply({ embeds: [embed] });
  },
};
