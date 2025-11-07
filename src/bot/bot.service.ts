import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./bot.schema";

@Injectable()
export class BotService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(chatId: number, firstName: string) {
    const exist = await this.userModel.findOne({ chatId });
    if (!exist) {
      const newUser = new this.userModel({ chatId, firstName });
      await newUser.save();
    }
  }

  async savePhone(chatId: number, phone: string) {
    await this.userModel.findOneAndUpdate({ chatId }, { phone });
  }

  async saveLocation(chatId: number, location: { latitude: number; longitude: number }) {
    await this.userModel.findOneAndUpdate({ chatId }, { location });
  }
}
