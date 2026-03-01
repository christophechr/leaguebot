import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getRulerCaughtCount, getRulerCaughtCountForYear } from "../db";

const data = new SlashCommandBuilder()
  .setName("drooler")
  .setDescription("Display how many times Ruler has been caught.")
  .addStringOption((option) =>
    option
      .setName("split")
      .setDescription("Split de la game")
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("annee")
      .setDescription("L'année de la game (e.g., 2024)")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("equipe")
      .setDescription("L'équipe qui a attrapé Drooler")
      .setRequired(false)
      .addChoices(
        { name: "BNX FearX", value: "BFX" },
        { name: "Hanjin Brion", value: "BRO" },
        { name: "DRX", value: "DRX" },
        { name: "DN Soopers", value: "DNS" },
        { name: "Dplus KIA", value: "DK" },
        { name: "Hanwha Life Esports", value: "HLE" },
        { name: "Nongshim RedForce", value: "NS" },
        { name: "T1", value: "T1" },
        { name: "KT Rolster", value: "KT" }
      )
  );

async function execute(interaction: ChatInputCommandInteraction) {
  const split = interaction.options.getString("split");
  const year = interaction.options.getInteger("annee") ?? new Date().getFullYear();
  const team = interaction.options.getString("equipe");
  const count = split
    ? await getRulerCaughtCount(split, year, team)
    : await getRulerCaughtCountForYear(year, team);
  await interaction.reply(`Ruler has been caught ${count} times in ${year}.`);
}

export const droolerCommand = { data, execute };
