import { isDebug, isProduction } from "./env";

type LogLevel = "debug" | "info" | "warn" | "error";

function shouldLog(level: LogLevel): boolean {
	if (level === "debug" && !isDebug()) {
		return false;
	}
	return true;
}

function serialize(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
	const payload = {
		ts: new Date().toISOString(),
		level,
		message,
		...meta
	};
	if (isProduction()) {
		return JSON.stringify(payload);
	}
	const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
	return `[${payload.ts}] ${level.toUpperCase()} ${message}${metaStr}`;
}

function write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
	if (!shouldLog(level)) {
		return;
	}
	const line = serialize(level, message, meta);
	if (level === "error") {
		console.error(line);
	} else if (level === "warn") {
		console.warn(line);
	} else {
		console.log(line);
	}
}

export const logger = {
	debug: (message: string, meta?: Record<string, unknown>) => write("debug", message, meta),
	info: (message: string, meta?: Record<string, unknown>) => write("info", message, meta),
	warn: (message: string, meta?: Record<string, unknown>) => write("warn", message, meta),
	error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta)
};
