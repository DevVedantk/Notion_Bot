import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api'
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your own bot token
const bot = new TelegramBot(process.env.TELEGRAM_KEY as string, { polling: true });

bot.on('message', async(msg:any) => {
  const chatId = msg.chat.id;
  const messageText = "generate Beginner Friendly road map on "+ msg.text+" In points like 1,2,3 etc.. using some emoji's and write more interactive message and don't use too texts or long paragraph i want short and clear";
  console.log("id is :",chatId)
  console.log(messageText)

  const result = await model.generateContent([messageText]);
console.log("this from gemini",result.response.text());
  const ResponseFromGemini=result.response.text();
 
    bot.sendMessage(chatId,ResponseFromGemini);
  

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }
})


//   bot.sendMessage(5811000784,"Hello and welcome to Notion Path");