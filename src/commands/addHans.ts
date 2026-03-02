import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { incrementHansFlashCount } from "../db";

const data = new SlashCommandBuilder()
  .setName("add_hans")
  .setDescription("Augmente le nombre de flash-in de Hans Sama.")
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
      .setDescription("L'année de la game (e.g., 2026)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("equipe")
      .setDescription("Hans Maga a flash-in contre quelle équipe ?")
      .setRequired(false)
      .setAutocomplete(true)
  );
  

async function execute(interaction: ChatInputCommandInteraction) {
  const split = interaction.options.getString("split", true);
  const year = interaction.options.getInteger("annee", true);
  const team = interaction.options.getString("equipe");
  const count = await incrementHansFlashCount(split, year, team);
  await interaction.reply(`Hans Sama a flash-in ${count} fois.`);
}

export const addHansCommand = { data, execute };
