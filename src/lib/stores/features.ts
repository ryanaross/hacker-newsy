import { storage } from "./storage";

export const infiniteScroll = storage<boolean>("infiniteScroll", false);

export type ThemeOption = "light" | "dark" | "dark-blue";
export const theme = storage<ThemeOption>("theme", "light");

export type FontOption = "system" | "serif" | "mono";
export const fontFamily = storage<FontOption>("fontFamily", "system");
