import { getAllReadIds, getAllSavedIds, getHighlightPatterns } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
	return {
		readIds: getAllReadIds(),
		savedIds: getAllSavedIds(),
		highlightPatterns: getHighlightPatterns()
	};
}) satisfies LayoutServerLoad;
