import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Weather } from "weather-api.ts";
import { ConfigService } from "../config/config.service";

export class StartCommand extends Command {
  private configService: ConfigService;
  private weatherOfCity: any;

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
    this.configService = new ConfigService();
  }

  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply("Напишите город в котором нужно узнать погоду");
    });
    this.bot.on("text", async (ctx) => {
      const city = ctx.message.text;
      try {
        this.weatherOfCity = await this.getWeather(city);
        ctx.reply(
          `Погода в городе ${this.weatherOfCity.location.name}:\n` +
            `Температура ${this.weatherOfCity.current.temp_c} по °C(по Цельсию)\n` +
            `Скорость ветра ${this.weatherOfCity.current.wind_kph} km/h\n` +
            `Влажность ${this.weatherOfCity.current.humidity}%\n` +
            `На данный момент: ${this.weatherOfCity.current.condition.text}`
        );
      } catch (err) {
        ctx.reply("Произошла ошибка при получении погоды");
        console.error(err);
      }
    });
  }

  private async getWeather(city: string) {
    return await new Weather(
      this.configService.getWeatherToken("WEATHER_API_TOKEN"),
      "ru"
    )
      .realtime({ q: city })
      .catch((err) => {
        throw new Error(err);
      });
  }
}
