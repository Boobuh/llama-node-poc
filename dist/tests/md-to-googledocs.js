/**
 * Converts UKRAINIAN_PUBLICATION.md to plain text for Google Docs paste.
 * Usage: npx tsx src/tests/md-to-googledocs.ts
 */
import fs from "node:fs";
import { PUBLICATION_GOOGLEDOCS_PATH, PUBLICATION_MARKDOWN_PATH, } from "../constants";
import { markdownToPlainText } from "../utils/markdown-to-plaintext";
const md = fs.readFileSync(PUBLICATION_MARKDOWN_PATH, "utf-8");
const text = markdownToPlainText(md);
fs.writeFileSync(PUBLICATION_GOOGLEDOCS_PATH, text, "utf-8");
console.log(`Wrote ${PUBLICATION_GOOGLEDOCS_PATH} (${text.length} chars)`);
//# sourceMappingURL=md-to-googledocs.js.map