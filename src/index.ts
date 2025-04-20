import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api'
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
//change some code

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



  const notionUrl = "https://api.notion.com/v1/pages";

  const headers = {
    "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };

 
  const data = {
    parent: {
      type: "page_id",
      page_id: process.env.NOTION_PARENT_PAGE_ID, 
    },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: msg.text,
            },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: ResponseFromGemini,
              },
            },
          ],
        },
      },
    ],
  };

  const res = await axios.post(notionUrl, data, { headers });
   console.log("this is from Notion ",res.data.url);

 
    bot.sendMessage(chatId,ResponseFromGemini);
  

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }
})


//   bot.sendMessage(5811000784,"Hello and welcome to Notion Path");