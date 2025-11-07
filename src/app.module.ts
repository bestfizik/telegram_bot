import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { BotService } from "./bot/bot.service";
import { BotUpdate } from "./bot/bot.update";
import { User, UserSchema } from "./bot/bot.schema";
import TelegramBot from "node-telegram-bot-api";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    MongooseModule.forRoot(process.env.MONGO_URL || ""),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    BotService,
    BotUpdate,
    {
      provide: "TELEGRAM_BOT",
      useFactory: () => {
        const token = process.env.TELEGRAM_TOKEN;
        return new TelegramBot(token || "", { polling: true });

      },
    },
  ],
})
export class AppModule {}
