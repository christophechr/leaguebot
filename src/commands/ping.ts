import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong and latency.");

async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
  const roundTripMs = sent.createdTimestamp - interaction.createdTimestamp;
  const apiMs = Math.round(interaction.client.ws.ping);
  await interaction.editReply(`Pong! 🏓 Round-trip: ${roundTripMs}ms | API: ${apiMs}ms`);
}

export const pingCommand = { data, execute };
