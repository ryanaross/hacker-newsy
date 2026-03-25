import { json, type RequestHandler } from "@sveltejs/kit";
import { markArticleUnread } from "$lib/server/db";

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return json({ ok: false, error: "invalid_id" }, { status: 400 });
	}
	const ok = markArticleUnread(id);
	if (!ok) {
		return json({ ok: false, error: "not_found" }, { status: 404 });
	}
	return json({ ok: true });
};
