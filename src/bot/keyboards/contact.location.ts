import { KeyboardButton } from "node-telegram-bot-api";

export const contactKeyboard = {
  reply_markup: {
    keyboard: [[{ text: "Telefon raqam yuborish", request_contact: true }]] as KeyboardButton[][],
    resize_keyboard: true,
  },
};

export const locationKeyboard = {
  reply_markup: {
    keyboard: [[{ text: "Lokatsiyani yuborish", request_location: true }]] as KeyboardButton[][],
    resize_keyboard: true,
  },
};
