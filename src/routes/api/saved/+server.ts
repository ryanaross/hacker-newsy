import { json, type RequestHandler } from "@sveltejs/kit";
import { getAllSavedIds, saveArticle } from "$lib/server/db";
import { logger } from "$lib/server/logger";

export const GET: RequestHandler = async () => {
	const ids = getAllSavedIds();
	return json({ ids });
};

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		logger.warn("saved_post_invalid_json");
		return json({ ok: false, error: "invalid_json" }, { status: 400 });
	}
	if (typeof body !== "object" || body === null) {
		return json({ ok: false, error: "invalid_body" }, { status: 400 });
	}
	const { id, url, title } = body as { id?: unknown; url?: unknown; title?: unknown };
	if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
		return json({ ok: false, error: "invalid_id" }, { status: 400 });
	}
	if (typeof url !== "string" || !url.trim()) {
		return json({ ok: false, error: "invalid_url" }, { status: 400 });
	}
	const titleStr = typeof title === "string" ? title : title == null ? null : String(title);
	saveArticle(id, url.trim(), titleStr);
	return json({ ok: true });
};
