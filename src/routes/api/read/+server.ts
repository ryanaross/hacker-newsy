import { json, type RequestHandler } from "@sveltejs/kit";
import { getAllReadIds, markArticleRead } from "$lib/server/db";
import { logger } from "$lib/server/logger";

export const GET: RequestHandler = async () => {
	const ids = getAllReadIds();
	return json({ ids });
};

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		logger.warn("read_post_invalid_json");
		return json({ ok: false, error: "invalid_json" }, { status: 400 });
	}
	const id =
		typeof body === "object" && body !== null && "id" in body
			? (body as { id: unknown }).id
			: undefined;
	if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
		return json({ ok: false, error: "invalid_id" }, { status: 400 });
	}
	markArticleRead(id);
	return json({ ok: true });
};
