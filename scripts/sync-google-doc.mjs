#!/usr/bin/env node
/**
 * @deprecated Use sync-google-doc-rich.mjs — plain text destroys Doc formatting.
 * Sync UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt → Google Doc via stored OAuth tokens.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

console.error("ERROR: scripts/sync-google-doc.mjs strips all formatting.");
console.error("Use: node scripts/sync-google-doc-rich.mjs");
process.exit(1);

const _unused = join(process.cwd(), "UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt");
const _h = homedir();
readFileSync;
