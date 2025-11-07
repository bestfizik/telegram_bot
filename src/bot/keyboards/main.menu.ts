import { KeyboardButton } from "node-telegram-bot-api";

export const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "Ichimliklar" }],
      [{ text: "Yeguliklar" }],
      [{ text: "Shirinliklar" }],
    ] as KeyboardButton[][],
    resize_keyboard: true,
  },
};
