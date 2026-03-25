import { dirname, resolve } from "node:path";

/**
 * Server-only environment helpers. PUID/PGID are applied in Docker via entrypoint.sh.
 * TZ is honored by Node automatically when set in the process environment.
 */
export function isDebug(): boolean {
	const v = process.env.DEBUG;
	return v === "true" || v === "1" || v === "yes";
}

export function isProduction(): boolean {
	return process.env.NODE_ENV === "production";
}

export function getDbPath(): string {
	const raw = process.env.DB_PATH?.trim();
	if (raw === ":memory:") {
		return ":memory:";
	}
	if (raw) {
		return resolve(raw);
	}
	return resolve(process.cwd(), "data", "hn.db");
}

/** One URL per line; lives next to the SQLite file by default. */
export function getSavedUrlsPath(): string {
	if (getDbPath() === ":memory:") {
		return resolve(process.cwd(), "data", "saved-urls.txt");
	}
	return resolve(dirname(getDbPath()), "saved-urls.txt");
}
