/**
 * Convert markdown to Google Docs API batchUpdate requests.
 * Preserves headings, lists, tables, and language-aware code blocks with syntax colors.
 */

import {
  highlightCode,
  tokensToPlainAndSpans,
} from "./code-highlight.mjs";

const CODE_FONT = "Courier New";
const CODE_BG = { red: 0.953, green: 0.957, blue: 0.965 };
const CODE_BORDER_COLOR = { red: 0.82, green: 0.835, blue: 0.859 };
const CODE_BORDER = {
  color: { color: { rgbColor: CODE_BORDER_COLOR } },
  width: { magnitude: 1, unit: "PT" },
  padding: { magnitude: 8, unit: "PT" },
  dashStyle: "SOLID",
};

export function parseMarkdownBlocks(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", lang, lines: codeLines });
      continue;
    }
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !/^\|[\s\-:|]+\|$/.test(l.replace(/\s/g, "")))
        .map((l) =>
          l
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim())
        );
      blocks.push({ type: "table", rows });
      continue;
    }
    if (line.startsWith("> ")) {
      const quote = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", text: quote.join(" ") });
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (line.trim() === "---") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    const para = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("- ") &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }

  return blocks;
}

function formatTableAsText(rows) {
  if (rows.length === 0) return [];
  const colCount = Math.max(...rows.map((r) => r.length));
  const clean = (s) =>
    (s ?? "")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1");
  const widths = Array.from({ length: colCount }, (_, c) =>
    Math.max(...rows.map((r) => clean(r[c]).length), 3)
  );
  return rows.map((row) =>
    Array.from({ length: colCount }, (_, c) => clean(row[c] ?? "").padEnd(widths[c])).join(
      "  "
    )
  );
}

export function buildBlockRequests(block, index) {
  const builder = new DocsBuilder(index);
  builder.applyOne(block);
  return { requests: builder.requests, endIndex: builder.index };
}

class DocsBuilder {
  constructor(startIndex = 1) {
    this.requests = [];
    this.index = startIndex;
  }

  applyOne(block) {
    switch (block.type) {
      case "h1":
        this.heading(block.text, "HEADING_1");
        break;
      case "h2":
        this.heading(block.text, "HEADING_2");
        break;
      case "h3":
        this.heading(block.text, "HEADING_3");
        break;
      case "p":
        this.paragraph(block.text);
        break;
      case "blockquote":
        this.paragraph(block.text, { italic: true });
        break;
      case "ul":
        for (const item of block.items) this.bullet(item);
        break;
      case "ol":
        for (const item of block.items) this.numbered(item);
        break;
      case "code":
        this.codeBlock(block.lines, block.lang);
        break;
      case "hr":
        this.paragraph("─".repeat(40));
        break;
      default:
        break;
    }
  }

  insert(text) {
    this.requests.push({
      insertText: { location: { index: this.index }, text },
    });
    const start = this.index;
    this.index += text.length;
    return { start, end: this.index };
  }

  heading(text, namedStyleType) {
    const { plain, spans } = parseInline(text);
    const range = this.insert(`${plain}\n`);
    this.requests.push({
      updateParagraphStyle: {
        range: { startIndex: range.start, endIndex: range.end },
        paragraphStyle: { namedStyleType },
        fields: "namedStyleType",
      },
    });
    this.addSpanStyles(range.start, spans);
  }

  paragraph(text, style = {}) {
    const { plain, spans } = parseInline(text);
    const range = this.insert(`${plain}\n`);
    if (style.italic) {
      this.requests.push({
        updateTextStyle: {
          range: { startIndex: range.start, endIndex: range.end - 1 },
          textStyle: { italic: true },
          fields: "italic",
        },
      });
    }
    this.addSpanStyles(range.start, spans);
  }

  bullet(text) {
    const { plain, spans } = parseInline(text);
    const range = this.insert(`${plain}\n`);
    this.requests.push({
      createParagraphBullets: {
        range: { startIndex: range.start, endIndex: range.end },
        bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
      },
    });
    this.addSpanStyles(range.start, spans);
  }

  numbered(text) {
    const { plain, spans } = parseInline(text);
    const range = this.insert(`${plain}\n`);
    this.requests.push({
      createParagraphBullets: {
        range: { startIndex: range.start, endIndex: range.end },
        bulletPreset: "NUMBERED_DECIMAL_ALPHA_ROMAN",
      },
    });
    this.addSpanStyles(range.start, spans);
  }

  codeBlock(lines, markdownLang = "") {
    const source = lines.join("\n");
    const { tokens } = highlightCode(source, markdownLang);
    const { plain, spans: colorSpans } = tokensToPlainAndSpans(tokens);

    const text = `${plain}\n\n`;
    const range = this.insert(text);
    const endContent = range.end - 2;

    this.requests.push({
      updateTextStyle: {
        range: { startIndex: range.start, endIndex: endContent },
        textStyle: {
          weightedFontFamily: { fontFamily: CODE_FONT },
          fontSize: { magnitude: 10, unit: "PT" },
        },
        fields: "weightedFontFamily,fontSize",
      },
    });

    for (const span of colorSpans) {
      this.requests.push({
        updateTextStyle: {
          range: {
            startIndex: range.start + span.start,
            endIndex: range.start + span.end,
          },
          textStyle: {
            foregroundColor: { color: { rgbColor: span.color } },
          },
          fields: "foregroundColor",
        },
      });
    }

    this.requests.push({
      updateParagraphStyle: {
        range: { startIndex: range.start, endIndex: range.end - 1 },
        paragraphStyle: {
          shading: { backgroundColor: { color: { rgbColor: CODE_BG } } },
          borderLeft: CODE_BORDER,
          borderRight: CODE_BORDER,
          borderTop: CODE_BORDER,
          borderBottom: CODE_BORDER,
          indentStart: { magnitude: 0, unit: "PT" },
          indentEnd: { magnitude: 0, unit: "PT" },
          spaceAbove: { magnitude: 6, unit: "PT" },
          spaceBelow: { magnitude: 6, unit: "PT" },
        },
        fields:
          "shading,borderLeft,borderRight,borderTop,borderBottom,indentStart,indentEnd,spaceAbove,spaceBelow",
      },
    });
  }

  addSpanStyles(base, spans) {
    for (const span of spans) {
      const start = base + span.start;
      const end = base + span.end;
      if (span.link) {
        this.requests.push({
          updateTextStyle: {
            range: { startIndex: start, endIndex: end },
            textStyle: { link: { url: span.link } },
            fields: "link",
          },
        });
      }
      if (span.bold) {
        this.requests.push({
          updateTextStyle: {
            range: { startIndex: start, endIndex: end },
            textStyle: { bold: true },
            fields: "bold",
          },
        });
      }
      if (span.code) {
        this.requests.push({
          updateTextStyle: {
            range: { startIndex: start, endIndex: end },
            textStyle: {
              weightedFontFamily: { fontFamily: CODE_FONT },
              fontSize: { magnitude: 10, unit: "PT" },
            },
            fields: "weightedFontFamily,fontSize",
          },
        });
      }
    }
  }
}

function parseInline(text) {
  let plain = "";
  const spans = [];
  let i = 0;

  while (i < text.length) {
    const mdLink = text.slice(i).match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (mdLink) {
      const start = plain.length;
      plain += mdLink[1];
      spans.push({ start, end: plain.length, link: mdLink[2] });
      i += mdLink[0].length;
      continue;
    }

    const bold = text.slice(i).match(/^\*\*([^*]+)\*\*/);
    if (bold) {
      const start = plain.length;
      plain += bold[1];
      spans.push({ start, end: plain.length, bold: true });
      i += bold[0].length;
      continue;
    }

    const code = text.slice(i).match(/^`([^`]+)`/);
    if (code) {
      const start = plain.length;
      plain += code[1];
      spans.push({ start, end: plain.length, code: true });
      i += code[0].length;
      continue;
    }

    const bareUrl = text.slice(i).match(/^https?:\/\/[^\s<>\])"]+/);
    if (bareUrl) {
      const start = plain.length;
      plain += bareUrl[0];
      spans.push({ start, end: plain.length, link: bareUrl[0] });
      i += bareUrl[0].length;
      continue;
    }

    plain += text[i];
    i++;
  }

  return { plain, spans };
}

export function findTableCellInsertIndex(document, tableIndex, row, col) {
  const content = document.body?.content ?? [];
  let seen = 0;
  for (const el of content) {
    if (!el.table) continue;
    if (seen === tableIndex) {
      const cell = el.table.tableRows?.[row]?.tableCells?.[col];
      const paragraph = cell?.content?.[0]?.paragraph;
      const elem = paragraph?.elements?.[0];
      return elem?.startIndex ?? null;
    }
    seen++;
  }
  return null;
}

export function tableRequests(document, tableIndex, rows) {
  const rowCount = rows.length;
  const colCount = Math.max(...rows.map((r) => r.length), 1);
  const normalized = rows.map((r) =>
    Array.from({ length: colCount }, (_, i) => r[i] ?? "")
  );

  const tableEl = (document.body?.content ?? []).filter((el) => el.table)[tableIndex];
  if (!tableEl?.table) return [];

  const inserts = [];
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const elem =
        tableEl.table.tableRows[r]?.tableCells[c]?.content?.[0]?.paragraph
          ?.elements?.[0];
      if (elem?.startIndex == null) continue;
      const { plain, spans } = parseInline(normalized[r][c]);
      inserts.push({ idx: elem.startIndex, plain, spans });
    }
  }

  // High index first; insert + style each cell before lower indices shift positions.
  inserts.sort((a, b) => b.idx - a.idx);
  const requests = [];
  for (const { idx, plain, spans } of inserts) {
    requests.push({ insertText: { location: { index: idx }, text: plain } });
    for (const span of spans) {
      const range = {
        startIndex: idx + span.start,
        endIndex: idx + span.end,
      };
      if (span.link) {
        requests.push({
          updateTextStyle: {
            range,
            textStyle: { link: { url: span.link } },
            fields: "link",
          },
        });
      }
      if (span.bold) {
        requests.push({
          updateTextStyle: {
            range,
            textStyle: { bold: true },
            fields: "bold",
          },
        });
      }
      if (span.code) {
        requests.push({
          updateTextStyle: {
            range,
            textStyle: {
              weightedFontFamily: { fontFamily: CODE_FONT },
              fontSize: { magnitude: 10, unit: "PT" },
            },
            fields: "weightedFontFamily,fontSize",
          },
        });
      }
    }
  }

  return requests;
}

export function tableHeaderBoldRequests(document, tableIndex) {
  const tableEl = (document.body?.content ?? []).filter((el) => el.table)[tableIndex];
  if (!tableEl?.table) return [];

  const requests = [];
  for (const cell of tableEl.table.tableRows[0]?.tableCells ?? []) {
    for (const elem of cell.content?.[0]?.paragraph?.elements ?? []) {
      const text = elem.textRun?.content ?? "";
      if (!text.trim()) continue;
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: elem.startIndex,
            endIndex: elem.endIndex - 1,
          },
          textStyle: { bold: true },
          fields: "bold",
        },
      });
    }
  }
  return requests;
}

export async function insertTableAt(docs, documentId, index, rows) {
  const rowCount = rows.length;
  const colCount = Math.max(...rows.map((r) => r.length), 1);
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertTable: {
            rows: rowCount,
            columns: colCount,
            location: { index },
          },
        },
      ],
    },
  });
  const doc = await docs.documents.get({ documentId });
  const tableIdx = countTables(doc.data) - 1;
  const cellReqs = tableRequests(doc.data, tableIdx, rows);
  if (cellReqs.length > 0) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests: cellReqs },
    });
  }
  const filled = await docs.documents.get({ documentId });
  const boldReqs = tableHeaderBoldRequests(filled.data, tableIdx);
  if (boldReqs.length > 0) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests: boldReqs },
    });
  }
  const updated = await docs.documents.get({ documentId });
  return getAppendIndex(updated.data);
}

export function getAppendIndex(document) {
  const content = document.body?.content ?? [];
  if (content.length === 0) return 1;
  const last = content[content.length - 1];
  return Math.max(1, (last.endIndex ?? 1) - 1);
}

function countTables(document) {
  return (document.body?.content ?? []).filter((el) => el.table).length;
}
