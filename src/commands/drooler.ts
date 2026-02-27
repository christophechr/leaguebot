import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getRulerCaughtCount } from "../db";

const data = new SlashCommandBuilder()
  .setName("drooler")
  .setDescription("Display how many times Ruler has been caught.");

async function execute(interaction: ChatInputCommandInteraction) {
  const count = await getRulerCaughtCount();
  await interaction.reply(`Ruler has been caught ${count} times.`);
}

export const droolerCommand = { data, execute };
