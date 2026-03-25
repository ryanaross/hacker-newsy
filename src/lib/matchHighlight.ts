/** Client-safe highlight matching (mirrors server logic for list rendering). */
export function matchesHighlight(
	title: string | undefined,
	domain: string | undefined,
	patterns: string[]
): boolean {
	if (!patterns.length) {
		return false;
	}
	const hayTitle = (title ?? "").toLowerCase();
	const hayDomain = (domain ?? "").toLowerCase();
	return patterns.some((p) => {
		const needle = p.toLowerCase();
		return hayTitle.includes(needle) || hayDomain.includes(needle);
	});
}
