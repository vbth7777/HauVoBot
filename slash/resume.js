const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the current song"),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("There are no songs in the queue");
    }
    const success = queue.setPaused(false);
    return interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`Resumed the song`)],
    });
  },
};
