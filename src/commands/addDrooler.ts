import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { incrementRulerCaughtCount } from "../db";

const data = new SlashCommandBuilder()
  .setName("add_drooler")
  .setDescription("Augmente le nombre de fois que Drooler a été attrapé.")
  .addStringOption((option) =>
    option
      .setName("split")
      .setDescription("Split de la game (Winter, Spring, Summer)")
      .setRequired(true)
      .addChoices(
        { name: "Winter", value: "winter" },
        { name: "Spring", value: "spring" },
        { name: "Summer", value: "summer" }
      )
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
  const split = interaction.options.getString("split", true);
  const year = interaction.options.getInteger("annee", true);
  const team = interaction.options.getString("equipe");
  const count = await incrementRulerCaughtCount(split, year, team);
  await interaction.reply(`Drooler a été attrapé ${count} fois.`);
}

export const addDroolerCommand = { data, execute };
