import { Injectable, Inject } from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import { BotService } from "./bot.service";
import { drinks } from "./data/drinks";
import { foods } from "./data/foods";
import { desserts } from "./data/deserts";
import { mainMenu } from "./keyboards/main.menu";
import { contactKeyboard, locationKeyboard } from "./keyboards/contact.location";

@Injectable()
export class BotUpdate {
  constructor(
    private readonly botService: BotService,
    @Inject("TELEGRAM_BOT") private readonly bot: TelegramBot
  ) {
    this.bot.onText(/\/start/, (msg) => this.start(msg));
    this.bot.on("message", (msg) => this.handleMessage(msg));
    this.bot.on("contact", (msg) => this.handleContact(msg));
    this.bot.on("location", (msg) => this.handleLocation(msg));
    this.bot.on("callback_query", (query) => this.handleCallback(query));
  }

  async start(msg: any) {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name || "";
    await this.botService.addUser(chatId, firstName);
    this.bot.sendMessage(chatId, `Salom ${firstName}! Fastfood menyuga xush kelibsiz!`, mainMenu);
  }

  async handleMessage(msg: any) {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    if (text.includes("Ichimliklar")) {
      drinks.forEach((item) => {
        this.bot.sendPhoto(chatId, item.img, {
          caption: `${item.name}\nNarxi: ${item.price} so‘m\n${item.info}`,
          reply_markup: { inline_keyboard: [[{ text: "Buyurtma berish", callback_data: `order_${item.id}` }]] },
        });
      });
    } else if (text.includes("Yeguliklar")) {
      foods.forEach((item) => {
        this.bot.sendPhoto(chatId, item.img, {
          caption: `${item.name}\nNarxi: ${item.price} so‘m\n${item.info}`,
          reply_markup: { inline_keyboard: [[{ text: "Buyurtma berish", callback_data: `order_${item.id}` }]] },
        });
      });
    } else if (text.includes("Shirinliklar")) {
      desserts.forEach((item) => {
        this.bot.sendPhoto(chatId, item.img, {
          caption: `${item.name}\nNarxi: ${item.price} so‘m\n${item.info}`,
          reply_markup: { inline_keyboard: [[{ text: "Buyurtma berish", callback_data: `order_${item.id}` }]] },
        });
      });
    }
  }

  async handleCallback(query: any) {
    const chatId = query.message.chat.id;
    const data = query.data;
    if (data.startsWith("order_")) {
      this.bot.sendMessage(chatId, "Buyurtmani yakunlash uchun telefon raqamingizni yuboring:", contactKeyboard);
    }
  }

  async handleContact(msg: any) {
    const chatId = msg.chat.id;
    const phone = msg.contact.phone_number;
    await this.botService.savePhone(chatId, phone);
    this.bot.sendMessage(chatId, "Telefon raqamingiz saqlandi! Iltimos, lokatsiyangizni yuboring:", locationKeyboard);
  }

  async handleLocation(msg: any) {
    const chatId = msg.chat.id;
    const location = msg.location;
    await this.botService.saveLocation(chatId, location);
    this.bot.sendMessage(chatId, "Lokatsiyangiz saqlandi! Buyurtmangiz qabul qilindi ", mainMenu);
  }
}
