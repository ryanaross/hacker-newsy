import { json, type RequestHandler } from "@sveltejs/kit";
import { addHighlightPattern, getHighlightPatterns } from "$lib/server/db";
import { logger } from "$lib/server/logger";

export const GET: RequestHandler = async () => {
	const patterns = getHighlightPatterns();
	return json({ patterns });
};

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		logger.warn("highlights_post_invalid_json");
		return json({ ok: false, error: "invalid_json" }, { status: 400 });
	}
	const pattern =
		typeof body === "object" && body !== null && "pattern" in body
			? (body as { pattern: unknown }).pattern
			: undefined;
	if (typeof pattern !== "string") {
		return json({ ok: false, error: "invalid_pattern" }, { status: 400 });
	}
	const created = addHighlightPattern(pattern);
	if (!created) {
		return json({ ok: false, error: "duplicate_or_empty" }, { status: 409 });
	}
	return json({ ok: true, id: created.id });
};
