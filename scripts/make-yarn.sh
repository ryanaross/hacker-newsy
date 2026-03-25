#!/usr/bin/env bash
# Make runs recipes with a minimal PATH; Yarn's launcher needs `node`. This script
# prepends common install locations and loads nvm/asdf when present.
set -uo pipefail

export PATH="${HOME}/.local/share/mise/shims:${HOME}/.volta/bin:${PATH}"
export PATH="/opt/homebrew/opt/node@22/bin:/opt/homebrew/opt/node@20/bin:/opt/homebrew/bin:/usr/local/bin:${PATH}"

if [[ -s "${HOME}/.nvm/nvm.sh" ]]; then
	# shellcheck source=/dev/null
	. "${HOME}/.nvm/nvm.sh" || true
fi
if [[ -s "${HOME}/.asdf/asdf.sh" ]]; then
	# shellcheck source=/dev/null
	. "${HOME}/.asdf/asdf.sh" || true
fi
if command -v fnm >/dev/null 2>&1; then
	eval "$(fnm env 2>/dev/null)" || true
fi

if ! command -v node >/dev/null 2>&1; then
	echo "make: node not found on PATH." >&2
	echo "Install Node 20+ (https://nodejs.org), or use Homebrew: brew install node" >&2
	exit 127
fi

if ! command -v yarn >/dev/null 2>&1; then
	echo "make: yarn not found on PATH (install Yarn or run: corepack enable)." >&2
	exit 127
fi

exec yarn "$@"
