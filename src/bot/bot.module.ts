import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { User, UserSchema } from './bot.schema';
import TelegramBot from 'node-telegram-bot-api';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    BotService,
    BotUpdate,
    {
      provide: 'TELEGRAM_BOT',
      useFactory: () => new TelegramBot(process.env.TELEGRAM_BOT_TOKEN||"", { polling: true }),
    },
  ],
})
export class BotModule {}
