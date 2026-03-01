import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { commands, commandMap } from "./commands";
import { INTERNATIONAL_TEAMS, LEC_TEAMS, SPLITS } from "./teams";
import { ensureDroolerTable, ensureHansFlashTable } from "./db";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error("Missing DISCORD_TOKEN in .env");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);

  const commandData = commands.map((c) => c.data);
  client.application?.commands
    .set(commandData)
    .then(() => console.log("Slash commands registered"))
    .catch((err) => console.error("Failed to register slash commands", err));
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete()) {
    if (
      interaction.commandName !== "add_hans" &&
      interaction.commandName !== "hans_maga" &&
      interaction.commandName !== "add_drooler" &&
      interaction.commandName !== "drooler"
    ) {
      return;
    }
    const focused = interaction.options.getFocused(true);
    const split = interaction.options.getString("split");
    const isLecSplit = split === "winter" || split === "spring" || split === "summer";
    const query = focused.value.toLowerCase();

    let options: { name: string; value: string }[] = [];
    if (focused.name === "split") {
      options = SPLITS;
    } else if (focused.name === "equipe_lec") {
      options = isLecSplit ? LEC_TEAMS : [];
    } else if (focused.name === "equipe") {
      options = isLecSplit ? LEC_TEAMS : [];
    } else if (focused.name === "equipe_international") {
      options = isLecSplit ? [] : INTERNATIONAL_TEAMS;
    }

    const filtered = options
      .filter((opt) => opt.name.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query))
      .slice(0, 25);
    await interaction.respond(filtered);
    return;
  }

  if (!interaction.isChatInputCommand()) return;
  const command = commandMap.get(interaction.commandName);
  if (!command) return;
  await command.execute(interaction);
});

async function start() {
  await ensureDroolerTable();
  await ensureHansFlashTable();
  await client.login(token);
}

start().catch((err) => {
  console.error("Failed to start bot", err);
  process.exit(1);
});
