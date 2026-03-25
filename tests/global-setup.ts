import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), ".playwright-data");

export default async function globalSetup() {
	rmSync(dataDir, { recursive: true, force: true });
	mkdirSync(dataDir, { recursive: true });
}
