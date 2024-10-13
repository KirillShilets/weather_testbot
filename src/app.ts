import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import LocalSession from "telegraf-session-local";

class Bot {
  bot: Telegraf<any>;

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<any>(this.configService.get("TOKEN"));
    this.bot.use(new LocalSession({ database: "sessions.json" }).middleware());
  }

  initialization() {
    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());
bot.initialization();
