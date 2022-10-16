const wait = require("node:timers/promises").setTimeout;
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Xem hàng đợi")
    .addNumberOption((option) =>
      option.setName("page").setDescription("Trang").setMinValue(0)
    ),
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing) {
      return interaction.editReply("Không có bài hát nào trong hàng đợi");
    }
    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    let page = (interaction.options.getNumber("page") || 1) - 1;
    if (page > totalPages) {
      return await interaction.editReply(
        `Trang phải nằm trong phạm vi từ 1 tới ${totalPages}`
      );
    }
    const getEmbed = (queueTracks, page = 1) => {
      const embed = new EmbedBuilder()
        .setDescription(
          `**Bài hát đang phát**: ${currentSong.title} - ${currentSong.requestedBy.username}\n\n**Hàng đợi**:\n` +
            queueTracks
        )
        .setThumbnail(currentSong.thumbnail)
        .setFooter({
          text: `Trang ${page + 1} / ${totalPages} | ${
            queue.tracks.length
          } bài hát`,
        });
      return embed;
    };
    const getQueueTracks = (page) => {
      return queue.tracks
        .slice(page * 10, (page + 1) * 10)
        .map((track, index) => {
          return `**${page * 10 + index + 1}.** ${track.title} - ${
            track.requestedBy.username
          }`;
        })
        .join("\n");
    };
    const getReply = (page) => {
      const queueTracks = getQueueTracks(page);
      const embed = getEmbed(queueTracks, page);
      return interaction.editReply({
        embeds: [embed],
        components: [
          new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setCustomId("previous")
              .setLabel("Trang trước")
              .setStyle(Discord.ButtonStyle.Primary)
              .setDisabled(page === 0),
            new Discord.ButtonBuilder()
              .setCustomId("next")
              .setLabel("Trang sau")
              .setStyle(Discord.ButtonStyle.Primary)
              .setDisabled(page === totalPages - 1)
          ),
        ],
        ephemeral: true,
      });
    };

    const currentSong = queue.current;
    await interaction.editReply(getReply(page));
    const filter = (interaction) => interaction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });
    collector.on("collect", async (interaction) => {
      if (interaction.customId === "previous") {
        page--;
        await interaction.update(getReply(page));
      } else if (interaction.customId === "next") {
        page++;
        await interaction.update(getReply(page));
      }
    });
    collector.on("end", async () => {
      await interaction.editReply({
        embeds: [getEmbed(getQueueTracks(page), page)],
        components: [],
      });
    });
  },
};
