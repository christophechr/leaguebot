import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { incrementRulerCaughtCount } from "../db";

const data = new SlashCommandBuilder()
  .setName("add_drooler")
  .setDescription("Increment the count of times Ruler has been caught.");

async function execute(interaction: ChatInputCommandInteraction) {
  const count = await incrementRulerCaughtCount();
  await interaction.reply(`Ruler has been caught ${count} times.`);
}

export const addDroolerCommand = { data, execute };
