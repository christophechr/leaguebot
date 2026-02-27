# Discord Bot in TypeScript — Quick Start

This guide walks you from zero to a working Discord bot using TypeScript.

## 1) Prerequisites
- Node.js 18+ (recommended)
- A Discord account
- A Discord application + bot token (Discord Developer Portal)

## 2) Create the bot in the Discord Developer Portal
1. Go to the Discord Developer Portal.
2. Create a new application.
3. Go to **Bot** → **Add Bot**.
4. Click **Reset Token** and copy the token (keep it secret).
5. Under **Privileged Gateway Intents**, enable what you need (for a simple bot, default is enough).

## 3) Initialize the project
From this folder:

```bash
npm init -y
```

## 4) Install dependencies
```bash
npm install discord.js dotenv
npm install -D typescript ts-node-dev @types/node
```

## 5) Configure TypeScript
Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## 6) Create environment file
Create `.env`:

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
```

## 7) Add a simple bot
Create `src/index.ts`:

```ts
import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error("Missing DISCORD_TOKEN in .env");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "!ping") {
    message.reply("Pong!");
  }
});

client.login(token);
```

## 8) Update scripts in `package.json`
Add these scripts:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 9) Invite the bot to a server
1. In the Developer Portal, go to **OAuth2 → URL Generator**.
2. Select scopes: `bot` and optionally `applications.commands`.
3. Select bot permissions (for the example: `Send Messages`, `Read Message History`).
4. Copy the generated URL and open it to invite the bot.

## 10) Run it
```bash
npm run dev
```
Then in your server, type `!ping` and the bot should reply `Pong!`.

---

## Next steps
- Add slash commands via `applications.commands` scope.
- Use a command handler pattern as the bot grows.
- Add logging and error handling for production.

If you want, tell me your desired features (slash commands, database, music, moderation, etc.) and I can scaffold those too.
