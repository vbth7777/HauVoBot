const Discord = require("discord.js");
const dotenv = require("dotenv");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { Player } = require("discord-player");
const { GatewayIntentBits } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const Env = require("./config.json");

dotenv.config();
const TOKEN = Env.token;

const LOAD_SLASH = process.argv[2] === "load";

const GUILD_ID = Env.guildID;
const CLIENT_ID = Env.clientID;

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highwaterMark: 1 << 25,
  },
});
let commands = [];
const slashFiles = fs
  .readdirSync("./slash")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const command = require(`./slash/${file}`);
  client.slashcommands.set(command.data.name, command);
  if (LOAD_SLASH) {
    commands.push(command.data.toJSON());
  }
}
if (LOAD_SLASH) {
  const rest = new REST({ version: "9" }).setToken(TOKEN);
  console.log("Loading slash commands...");
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
} else {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  client.on("interactionCreate", async (interaction) => {
    async function handleCommand(command) {
      if (!interaction.isCommand()) return;

      const slashcmd = client.slashcommands.get(interaction.commandName);
      if (!slashcmd)
        interaction.reply({
          embeds: [new EmbedBuilder().setDescription("Lệnh không hợp lệ")],
        });

      await interaction.deferReply();
      await slashcmd.run(client, interaction);
    }
    handleCommand();
  });
  client.login(TOKEN);
}
