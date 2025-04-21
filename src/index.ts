import dotenv from 'dotenv';
dotenv.config();
process.env.NTBA_FIX_350 = 'true';
import TelegramBot from 'node-telegram-bot-api'
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument, { file } from 'pdfkit';
import fs from 'fs';
import path from 'path';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your own bot token
const bot = new TelegramBot(process.env.TELEGRAM_KEY as string, { polling: true });

bot.on('message', async(msg:any) => {
  const chatId = msg.chat.id;
  console.log(msg.text)

  if (msg.text === '/start') {
    bot.sendMessage(chatId, `Welcome to TSX 2005
       Your Complete Beginner-Friendly Roadmap Builder 🚀🛠️📚
This bot is your personal AI assistant that creates a step-by-step learning roadmap based on your custom commands 💡🧠✨.

It generates a fully AI-powered roadmap tailored just for you 🎯🤖, ensuring you stay on the right track from start to success ✅📈.

You’ll receive your complete roadmap as a professional-looking PDF document 📄📥, ready to download and follow anytime 📚✨.

So let’s get started and build your future, one roadmap at a time! 🔥🛤️👨‍💻

Now What Drop Message Like 'Hey i want to learn something like this and See your RoadMap on that'
`);
  } else{

  
  const messageText = "generate Beginner Friendly road map on "+ msg.text+"  and give info In points like 1,2,3 etc.. using some emoji's and write more interactive message.";

  const result = await model.generateContent([messageText]);

  const ResponseFromGemini=result.response.text();
  
  const doc=new PDFDocument();
  const filePath = `./roadmap-${chatId}.pdf`; // Create a file for the specific chat ID to avoid collisions

  doc.registerFont('EmojiFont', path.join(__dirname,'..' ,'Symbola.ttf'));



  doc.pipe(fs.createWriteStream(filePath)); 
  doc.font('EmojiFont');
  doc.fontSize(12).text("Begginer Friendly Roadmap 🚀🚀", { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(ResponseFromGemini); // Add the generated content from Gemini

  doc.end();
 

  setTimeout(async()=>{

  
    try {
      const fileBuffer = fs.readFileSync(filePath);
      await bot.sendDocument(chatId, fileBuffer, {},{
        filename: `roadmap-${chatId}.pdf`,
        contentType: 'application/pdf',
      });
      // fs.unlinkSync(fi
    } catch (error) {
      console.error('Error sending document:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error sending the file.');
    }

  },1000)
   // Delay to ensure the file is fully written
  
}
})