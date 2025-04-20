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
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Check if required environment variables are set
if (!process.env.GEMINI_KEY || !process.env.TELEGRAM_KEY) {
    console.error('Missing environment variables');
    process.exit(1);
}
const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_KEY, { polling: true });
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const messageText = "generate Beginner Friendly road map on " + msg.text + " In points like 1,2,3 etc.. using some emoji's and write more interactive message and don't use too texts or long paragraph i want short and clear";
    console.log("id is:", chatId);
    console.log(messageText);
    try {
        const result = yield model.generateContent([messageText]);
        const ResponseFromGemini = result.response.text();
        console.log("This is from Gemini:", ResponseFromGemini);
        // Create a PDF document
        const doc = new pdfkit_1.default();
        const filePath = `./roadmap-${chatId}.pdf`; // Create a file for the specific chat ID to avoid collisions
        doc.pipe(fs_1.default.createWriteStream(filePath)); // Stream the file to disk
        doc.fontSize(12).text("Roadmap for: " + msg.text, { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(ResponseFromGemini); // Add the generated content from Gemini
        doc.end();
        // Wait for the PDF file to be written before sending it
        doc.on('finish', () => {
            // Send the PDF file to the user
            bot.sendDocument(chatId, filePath).then(() => {
                // After sending, delete the file from the server
                fs_1.default.unlinkSync(filePath);
            }).catch((err) => {
                console.error("Error sending PDF:", err);
                bot.sendMessage(chatId, "Oops! Something went wrong. Please try again later.");
            });
        });
    }
    catch (error) {
        console.error("Error occurred:", error);
        bot.sendMessage(chatId, "Oops! Something went wrong. Please try again later.");
    }
    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Welcome to the bot!');
    }
}));
