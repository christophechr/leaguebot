import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { incrementRulerCaughtCount } from "../db";

const data = new SlashCommandBuilder()
  .setName("add_drooler")
  .setDescription("Augmente le nombre de fois que Drooler a été attrapé.")
  .addStringOption((option) =>
    option
      .setName("split")
      .setDescription("Split de la game")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("annee")
      .setDescription("L'année de la game (e.g., 2024)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("equipe")
      .setDescription("L'équipe qui a attrapé Drooler")
      .setRequired(false)
      .setAutocomplete(true)
    );

async function execute(interaction: ChatInputCommandInteraction) {
  const split = interaction.options.getString("split", true);
  const year = interaction.options.getInteger("annee", true);
  const team = interaction.options.getString("equipe");
  const count = await incrementRulerCaughtCount(split, year, team);
  await interaction.reply(`Drooler a été attrapé ${count} fois.`);
}

export const addDroolerCommand = { data, execute };
