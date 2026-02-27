import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { commands, commandMap } from "./commands";
import { ensureDroolerTable } from "./db";

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
  if (!interaction.isChatInputCommand()) return;
  const command = commandMap.get(interaction.commandName);
  if (!command) return;
  await command.execute(interaction);
});

async function start() {
  await ensureDroolerTable();
  await client.login(token);
}

start().catch((err) => {
  console.error("Failed to start bot", err);
  process.exit(1);
});
