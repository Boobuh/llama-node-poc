#!/usr/bin/env node
/**
 * Sync UKRAINIAN_PUBLICATION.md → Google Doc with rich formatting.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { google } from "googleapis";
import {
  buildBlockRequests,
  getAppendIndex,
  insertTableAt,
  parseMarkdownBlocks,
} from "./lib/markdown-to-google-docs.mjs";

const DOC_ID = process.env.GOOGLE_DOC_ID ?? "18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw";
const SOURCE = join(process.cwd(), "UKRAINIAN_PUBLICATION.md");
const CREDS = join(homedir(), ".config/google-workspace-mcp/credentials.json");
const TOKENS = join(homedir(), ".config/google-workspace-mcp/tokens.json");
const BLOCKS_PER_BATCH = 6;

function loadAuth() {
  const credentials = JSON.parse(readFileSync(CREDS, "utf8"));
  const tokens = JSON.parse(readFileSync(TOKENS, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oauth2 = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oauth2.setCredentials(tokens);
  return oauth2;
}

async function batchUpdateWithRetry(docs, documentId, requests) {
  if (requests.length === 0) return;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      await docs.documents.batchUpdate({
        documentId,
        requestBody: { requests },
      });
      return;
    } catch (err) {
      if (err.code === 429 && attempt < 7) {
        const wait = 20_000 * (attempt + 1);
        console.log(`Rate limited — waiting ${wait / 1000}s…`);
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
}

function nextIndexAfterRequests(requests, startIndex) {
  let index = startIndex;
  for (const req of requests) {
    if (req.insertText) {
      index = req.insertText.location.index + req.insertText.text.length;
    }
  }
  return index;
}

async function applyBlockBatch(docs, documentId, startIndex, blocks) {
  let index = startIndex;
  const allRequests = [];
  for (const block of blocks) {
    const { requests } = buildBlockRequests(block, index);
    allRequests.push(...requests);
    index = nextIndexAfterRequests(requests, index);
  }
  await batchUpdateWithRetry(docs, documentId, allRequests);
  const doc = await docs.documents.get({ documentId });
  return getAppendIndex(doc.data);
}

async function clearDocument(docs, documentId) {
  const doc = await docs.documents.get({ documentId });
  const endIndex = doc.data.body?.content?.at(-1)?.endIndex ?? 1;
  if (endIndex <= 2) return 1;
  await batchUpdateWithRetry(docs, documentId, [
    {
      deleteContentRange: {
        range: { startIndex: 1, endIndex: endIndex - 1 },
      },
    },
  ]);
  return 1;
}

async function main() {
  const markdown = readFileSync(SOURCE, "utf8");
  const blocks = parseMarkdownBlocks(markdown);
  const auth = loadAuth();
  const docs = google.docs({ version: "v1", auth });

  console.log("Clearing document…");
  let index = await clearDocument(docs, DOC_ID);
  const pending = [];

  console.log(`Applying ${blocks.length} blocks with formatting…`);
  for (const block of blocks) {
    if (block.type === "table") {
      if (pending.length > 0) {
        index = await applyBlockBatch(docs, DOC_ID, index, pending.splice(0));
        await sleep(1200);
      }
      index = await insertTableAt(docs, DOC_ID, index, block.rows);
      await sleep(1200);
      continue;
    }

    pending.push(block);
    if (pending.length >= BLOCKS_PER_BATCH) {
      index = await applyBlockBatch(docs, DOC_ID, index, pending.splice(0));
      await sleep(1200);
    }
  }

  if (pending.length > 0) {
    index = await applyBlockBatch(docs, DOC_ID, index, pending);
  }

  console.log(`Done — rich sync to ${DOC_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
