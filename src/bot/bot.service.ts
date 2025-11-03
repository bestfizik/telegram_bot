import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import { Bot } from './bot.schema';

@Injectable()
export class BotService {
  private bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });
  private adminId = Number(process.env.ADMIN_ID);

  private userMessages = new Map<number, number>(); // admin javob berishi uchun

  constructor(@InjectModel(Bot.name) private botModel: Model<Bot>) {
    
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'Foydalanuvchi';

      if (chatId === this.adminId) return;

      this.bot.sendMessage(
        this.adminId,
        `Yangi foydalanuvchi:\n ${firstName}\n ${chatId}`,
        { parse_mode: 'Markdown' },
      );

      
      this.bot.sendMessage(
        chatId,
        `Assalomu alaykum, ${firstName}!\nMurojaatingizni matn yoki ovozli xabar ko'rinishida yuboring.`,
      );
    });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'Foydalanuvchi';

      if (chatId === this.adminId && msg.reply_to_message) {
        const userId = this.userMessages.get(msg.reply_to_message.message_id);
        if (userId) {
          this.bot.sendMessage(userId, msg.text || '');
        }
        return;
      }

   
      if (chatId !== this.adminId && msg.text && msg.text !== '/start') {
        const forwarded = await this.bot.sendMessage(
          this.adminId,
          ` Murojaat\n👤 ${firstName}\n ${chatId}\n\n${msg.text}`,
          { parse_mode: 'Markdown' },
        );

       
        this.userMessages.set(forwarded.message_id, chatId);

      
        this.bot.sendMessage(chatId, 'Xabaringiz ustozga yuborildi.');
      }
    });


    this.bot.on('voice', async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'Foydalanuvchi';
      const voice = msg.voice?.file_id;

      if (!voice || chatId === this.adminId) return;

      const forwarded = await this.bot.sendMessage(
        this.adminId,
        `Ovozli murojaat\n${firstName}\n${chatId}`,
        { parse_mode: 'Markdown' },
      );

      await this.bot.sendVoice(this.adminId, voice);

      this.userMessages.set(forwarded.message_id, chatId);

      this.bot.sendMessage(chatId, 'Ovozli xabaringiz ustozga yuborildi.');
    });
  }
}
