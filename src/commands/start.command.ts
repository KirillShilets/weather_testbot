import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Weather } from "weather-api.ts";
import { ConfigService } from "../config/config.service";

export class StartCommand extends Command {
  private configService: ConfigService;

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
    this.configService = new ConfigService();
  }

  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply("Напишите город в котором нужно узнать погоду");
    });
    this.bot.on("text", (ctx) => {
      const city = ctx.message.text;
      const result = this.getWeather(city);
      if (result == undefined) {
        ctx.reply("Не найдено, повторите попытку");
      }
    });
  }

  private async getWeather(city: string) {
    try {
      await new Weather(this.configService.getWeatherToken("WEATHER_API_TOKEN"))
        .realtime({ q: city })
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      throw new Error("Ошибка при получении данных о погоде");
    }
  }
}
