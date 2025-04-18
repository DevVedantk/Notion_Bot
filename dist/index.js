"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
// const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your own bot token
const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_KEY, { polling: true });
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    console.log("id is :", chatId);
    console.log(messageText);
    if (messageText === "typescript") {
        bot.sendMessage(chatId, "here is the raod map for typescript!!!");
    }
    if (messageText === '/start') {
        bot.sendMessage(chatId, 'Welcome to the bot!');
    }
});
//   bot.sendMessage(5811000784,"Hello and welcome to Notion Path");
