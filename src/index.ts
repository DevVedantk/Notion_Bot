import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api'

// const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your own bot token
const bot = new TelegramBot(process.env.TELEGRAM_KEY as string, { polling: true });

bot.on('message', (msg:any) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  console.log("id is :",chatId)
  console.log(messageText)

  if(messageText==="typescript"){
    bot.sendMessage(chatId,"here is the raod map for typescript!!!");
  }

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }
})


//   bot.sendMessage(5811000784,"Hello and welcome to Notion Path");