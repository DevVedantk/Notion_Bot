"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your own bot token
const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_KEY, { polling: true });
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const messageText = "generate Beginner Friendly road map on " + msg.text + " In points like 1,2,3 etc.. using some emoji's and write more interactive message and don't use too texts or long paragraph i want short and clear";
    console.log("id is :", chatId);
    console.log(messageText);
    const result = yield model.generateContent([messageText]);
    console.log("this from gemini", result.response.text());
    const ResponseFromGemini = result.response.text();
    bot.sendMessage(chatId, ResponseFromGemini);
    if (messageText === '/start') {
        bot.sendMessage(chatId, 'Welcome to the bot!');
    }
}));
//   bot.sendMessage(5811000784,"Hello and welcome to Notion Path");
