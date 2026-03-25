import type { Handle, HandleServerError } from "@sveltejs/kit";
import { logger } from "$lib/server/logger";

export const handle: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	try {
		const response = await resolve(event);
		const durationMs = Date.now() - start;
		logger.info("request", {
			method: event.request.method,
			path: event.url.pathname,
			status: response.status,
			durationMs
		});
		return response;
	} catch (e) {
		const durationMs = Date.now() - start;
		logger.error("request_failed", {
			method: event.request.method,
			path: event.url.pathname,
			durationMs,
			error: e instanceof Error ? e.message : String(e)
		});
		throw e;
	}
};

export const handleError: HandleServerError = ({ error, event }) => {
	const message = error instanceof Error ? error.message : String(error);
	logger.error("server_error", {
		message,
		path: event.url.pathname,
		stack: error instanceof Error ? error.stack : undefined
	});
	const expose = process.env.NODE_ENV !== "production";
	return {
		message: expose && error instanceof Error ? error.message : "Internal Error"
	};
};
