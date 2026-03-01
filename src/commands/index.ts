import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder
} from "discord.js";
import { addDroolerCommand } from "./addDrooler";
import { addHansCommand } from "./addHans";
import { droolerCommand } from "./drooler";
import { hansMagaCommand } from "./hansMaga";
import { pingCommand } from "./ping";

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export const commands: Command[] = [
  pingCommand,
  addDroolerCommand,
  droolerCommand,
  addHansCommand,
  hansMagaCommand
];

export const commandMap = new Map(commands.map((c) => [c.data.name, c]));
