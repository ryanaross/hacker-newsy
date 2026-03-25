import { json, type RequestHandler } from "@sveltejs/kit";
import { exportSavedUrls } from "$lib/server/db";

export const POST: RequestHandler = async () => {
	const { count } = exportSavedUrls();
	return json({ ok: true, count });
};
