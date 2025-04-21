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
process.env.NTBA_FIX_350 = 'true';
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const generative_ai_1 = require("@google/generative-ai");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your own bot token
const bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_KEY, { polling: true });
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    console.log(msg.text);
    if (msg.text === '/start') {
        bot.sendMessage(chatId, `Welcome to TSX 2005
       Your Complete Beginner-Friendly Roadmap Builder 🚀🛠️📚
This bot is your personal AI assistant that creates a step-by-step learning roadmap based on your custom commands 💡🧠✨.

It generates a fully AI-powered roadmap tailored just for you 🎯🤖, ensuring you stay on the right track from start to success ✅📈.

You’ll receive your complete roadmap as a professional-looking PDF document 📄📥, ready to download and follow anytime 📚✨.

So let’s get started and build your future, one roadmap at a time! 🔥🛤️👨‍💻

Now What Drop Message Like 'Hey i want to learn something like this and See your RoadMap on that'
`);
    }
    else {
        const messageText = "generate Beginner Friendly road map on " + msg.text + "  and give info In points like 1,2,3 etc.. using some emoji's and write more interactive message.";
        const result = yield model.generateContent([messageText]);
        const ResponseFromGemini = result.response.text();
        const doc = new pdfkit_1.default();
        const filePath = `./roadmap-${chatId}.pdf`; // Create a file for the specific chat ID to avoid collisions
        doc.registerFont('EmojiFont', path_1.default.join(__dirname, '..', 'Symbola.ttf'));
        doc.pipe(fs_1.default.createWriteStream(filePath));
        doc.font('EmojiFont');
        doc.fontSize(12).text("Begginer Friendly Roadmap 🚀🚀", { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(ResponseFromGemini); // Add the generated content from Gemini
        doc.end();
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const fileBuffer = fs_1.default.readFileSync(filePath);
                yield bot.sendDocument(chatId, fileBuffer, {}, {
                    filename: `roadmap-${chatId}.pdf`,
                    contentType: 'application/pdf',
                });
                // fs.unlinkSync(fi
            }
            catch (error) {
                console.error('Error sending document:', error);
                bot.sendMessage(chatId, 'Sorry, there was an error sending the file.');
            }
        }), 1000);
        // Delay to ensure the file is fully written
    }
}));
