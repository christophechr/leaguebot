import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getHansFlashCount, getHansFlashCountForYear } from "../db";

const data = new SlashCommandBuilder()
  .setName("hans_maga")
  .setDescription("Apffiche le nombre de flash-in de Hans Maga")
  .addStringOption((option) =>
    option
      .setName("split")
      .setDescription("Split de la game (Winter, Spring, Summer)")
      .setRequired(false)
      .addChoices(
        { name: "Winter", value: "winter" },
        { name: "First Stand", value: "FST" },
        { name: "Spring", value: "spring" },
        { name: "Mid-Season Invitational", value: "MSI" },
        { name: "Summer", value: "summer" },
        { name: "Worlds", value: "worlds" }
      )
  )
  .addIntegerOption((option) =>
    option
      .setName("annee")
      .setDescription("L'année de la game (e.g., 2026)")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("equipe")
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
  const split = interaction.options.getString("split");
  const year = interaction.options.getInteger("annee") ?? new Date().getFullYear();
  const isLecSplit = split === "winter" || split === "spring" || split === "summer";
  const lecTeam = interaction.options.getString("equipe");
  const intlTeam = interaction.options.getString("equipe_international");
  const team = isLecSplit ? lecTeam : intlTeam;

  if (isLecSplit && intlTeam) {
    await interaction.reply({
      content: "Choisis `equipe` pour Winter/Spring/Summer.",
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
  const count = split
    ? await getHansFlashCount(split, year, team)
    : await getHansFlashCountForYear(year, team);
  await interaction.reply(`Hans Sama a flash-in ${count} fois en ${year}.`);
}

export const hansMagaCommand = { data, execute };
