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
      .setName("equipe_lec")
      .setDescription("Équipe LEC (Winter/Spring/Summer)")
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName("equipe_international")
      .setDescription("Équipe internationale (autres splits)")
      .setRequired(false)
      .setAutocomplete(true)
  );

async function execute(interaction: ChatInputCommandInteraction) {
  const split = interaction.options.getString("split", true);
  const year = interaction.options.getInteger("annee", true);
  const isLecSplit = split === "winter" || split === "spring" || split === "summer";
  const lecTeam = interaction.options.getString("equipe_lec");
  const intlTeam = interaction.options.getString("equipe_international");
  const team = isLecSplit ? lecTeam : intlTeam;

  if (isLecSplit && intlTeam) {
    await interaction.reply({
      content: "Choisis `equipe_lec` pour Winter/Spring/Summer.",
      ephemeral: true
    });
    return;
  }

  if (!isLecSplit && lecTeam) {
    await interaction.reply({
      content: "Choisis `equipe_international` pour les autres splits.",
      ephemeral: true
    });
    return;
  }
  const count = await incrementHansFlashCount(split, year, team);
  await interaction.reply(`Hans Sama a flash-in ${count} fois.`);
}

export const addHansCommand = { data, execute };
