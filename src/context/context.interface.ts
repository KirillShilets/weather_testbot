import { Context } from "telegraf";

export interface SessionData {
  city: string;
}

export interface IBotContext extends Context {
  session: SessionData;
}
