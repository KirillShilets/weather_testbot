export interface IConfigService {
  getBotToken(key: string): string;
  getWeatherToken(key: string): string;
}
