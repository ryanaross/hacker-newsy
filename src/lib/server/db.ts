import Database from "better-sqlite3";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { getDbPath, getSavedUrlsPath } from "./env";
import { logger } from "./logger";

let dbInstance: Database.Database | null = null;

function migrate(database: Database.Database) {
	database.exec(`
		CREATE TABLE IF NOT EXISTS read_articles (
			article_id INTEGER PRIMARY KEY,
			read_at TEXT DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS highlight_patterns (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			pattern TEXT NOT NULL UNIQUE,
			created_at TEXT DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS saved_articles (
			article_id INTEGER PRIMARY KEY,
			url TEXT NOT NULL,
			title TEXT,
			saved_at TEXT DEFAULT (datetime('now'))
		);
	`);
}

export function getDb(): Database.Database {
	if (dbInstance) {
		return dbInstance;
	}
	const path = getDbPath();
	const isMemory = path === ":memory:";
	if (!isMemory) {
		mkdirSync(dirname(path), { recursive: true });
	}
	dbInstance = new Database(path);
	dbInstance.pragma("journal_mode = WAL");
	migrate(dbInstance);
	logger.info("database_opened", { path });
	return dbInstance;
}

/** Test / hot-reload cleanup */
export function closeDb() {
	if (dbInstance) {
		dbInstance.close();
		dbInstance = null;
	}
}

/** On-demand export of saved URLs to the text file. */
export function exportSavedUrls(): { path: string; count: number } {
	const database = getDb();
	const rows = database
		.prepare(`SELECT url FROM saved_articles ORDER BY datetime(saved_at) ASC, article_id ASC`)
		.all() as { url: string }[];
	const content = rows.map((r) => r.url).join("\n") + (rows.length ? "\n" : "");
	const filePath = getSavedUrlsPath();
	mkdirSync(dirname(filePath), { recursive: true });
	writeFileSync(filePath, content, "utf8");
	logger.info("saved_urls_exported", { path: filePath, count: rows.length });
	return { path: filePath, count: rows.length };
}

export function getAllReadIds(): number[] {
	const database = getDb();
	const rows = database.prepare(`SELECT article_id FROM read_articles`).all() as {
		article_id: number;
	}[];
	return rows.map((r) => r.article_id);
}

export function markArticleRead(articleId: number) {
	const database = getDb();
	database.prepare(`INSERT OR REPLACE INTO read_articles (article_id) VALUES (?)`).run(articleId);
	logger.debug("article_marked_read", { articleId });
}

export function markArticleUnread(articleId: number): boolean {
	const database = getDb();
	const result = database.prepare(`DELETE FROM read_articles WHERE article_id = ?`).run(articleId);
	const ok = result.changes > 0;
	if (ok) {
		logger.debug("article_marked_unread", { articleId });
	}
	return ok;
}

export function getHighlightPatterns(): { id: number; pattern: string }[] {
	const database = getDb();
	return database.prepare(`SELECT id, pattern FROM highlight_patterns ORDER BY id ASC`).all() as {
		id: number;
		pattern: string;
	}[];
}

export function addHighlightPattern(pattern: string): { id: number } | null {
	const trimmed = pattern.trim();
	if (!trimmed) {
		return null;
	}
	const database = getDb();
	try {
		const result = database
			.prepare(`INSERT INTO highlight_patterns (pattern) VALUES (?)`)
			.run(trimmed);
		logger.info("highlight_pattern_added", { id: result.lastInsertRowid, pattern: trimmed });
		return { id: Number(result.lastInsertRowid) };
	} catch (e) {
		logger.warn("highlight_pattern_duplicate", { pattern: trimmed, error: String(e) });
		return null;
	}
}

export function deleteHighlightPattern(id: number): boolean {
	const database = getDb();
	const result = database.prepare(`DELETE FROM highlight_patterns WHERE id = ?`).run(id);
	const ok = result.changes > 0;
	if (ok) {
		logger.info("highlight_pattern_deleted", { id });
	}
	return ok;
}

export function getAllSavedIds(): number[] {
	const database = getDb();
	const rows = database.prepare(`SELECT article_id FROM saved_articles`).all() as {
		article_id: number;
	}[];
	return rows.map((r) => r.article_id);
}

export function saveArticle(articleId: number, url: string, title: string | null) {
	const database = getDb();
	database
		.prepare(`INSERT OR REPLACE INTO saved_articles (article_id, url, title) VALUES (?, ?, ?)`)
		.run(articleId, url, title);
	logger.info("article_saved", { articleId, url });
}

export function removeSavedArticle(articleId: number): boolean {
	const database = getDb();
	const result = database.prepare(`DELETE FROM saved_articles WHERE article_id = ?`).run(articleId);
	const ok = result.changes > 0;
	if (ok) {
		logger.info("article_unsaved", { articleId });
	}
	return ok;
}

/** Vitest only: wipe all rows */
export function clearAllForTests() {
	if (process.env.VITEST !== "true") {
		throw new Error("clearAllForTests is only allowed under Vitest");
	}
	const database = getDb();
	database.exec(
		`DELETE FROM read_articles; DELETE FROM highlight_patterns; DELETE FROM saved_articles;`
	);
}
