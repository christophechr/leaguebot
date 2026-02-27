import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { addDroolerCommand } from "./addDrooler";
import { droolerCommand } from "./drooler";
import { pingCommand } from "./ping";

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export const commands: Command[] = [pingCommand, addDroolerCommand, droolerCommand];

export const commandMap = new Map(commands.map((c) => [c.data.name, c]));
