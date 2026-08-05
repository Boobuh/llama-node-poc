/**
 * Map markdown fence language tags → Google Docs code block language names.
 * @see Insert > Building blocks > Code block in Google Docs UI
 */
export const DOCS_CODE_LANGUAGES = new Set([
  "CPP",
  "JAVA",
  "JAVASCRIPT",
  "KOTLIN",
  "MARKDOWN",
  "PROTOBUF",
  "PYTHON",
  "RUST",
  "SHELL",
  "SQL",
  "SWIFT",
  "TEXTPROTO",
  "TYPESCRIPT",
  "XML",
  "JSON",
  "NONE",
]);

const LANG_ALIASES = {
  typescript: "TYPESCRIPT",
  ts: "TYPESCRIPT",
  javascript: "JAVASCRIPT",
  js: "JAVASCRIPT",
  bash: "SHELL",
  sh: "SHELL",
  shell: "SHELL",
  json: "JSON",
  dockerfile: "SHELL",
  python: "PYTHON",
  py: "PYTHON",
  sql: "SQL",
  markdown: "MARKDOWN",
  md: "MARKDOWN",
  rust: "RUST",
  java: "JAVA",
  xml: "XML",
  kotlin: "KOTLIN",
  swift: "SWIFT",
  cpp: "CPP",
  "c++": "CPP",
  protobuf: "PROTOBUF",
  textproto: "TEXTPROTO",
  text: "NONE",
  plaintext: "NONE",
};

export function mapDocsLanguage(markdownLang, source = "") {
  const key = (markdownLang ?? "").trim().toLowerCase();
  if (key) return LANG_ALIASES[key] ?? "NONE";
  return inferLanguage(source);
}

function inferLanguage(source) {
  const sample = source.trim().slice(0, 500);
  if (!sample) return "NONE";
  if (/^[\s│├└─]+/.test(sample) || sample.includes("├──")) return "NONE";
  if (/^\{[\s\S]*"[\w-]+"\s*:/m.test(sample) || /^\[\s*$/.test(sample.split("\n")[0])) {
    return "JSON";
  }
  if (
    /^(import |export |const |let |var |async |function |type |interface )/m.test(sample) ||
    /from ["']/.test(sample)
  ) {
    return "TYPESCRIPT";
  }
  if (/^(FROM |RUN |CMD |WORKDIR |ENV |EXPOSE )/m.test(sample)) return "SHELL";
  if (/^(npm |npx |curl |wget |ollama |git |export |mkdir |cd |docker )/m.test(sample)) {
    return "SHELL";
  }
  const firstLine = sample.split("\n").find((l) => l.trim()) ?? "";
  if (/^#/.test(firstLine)) return "SHELL";
  return "NONE";
}

/** Google Docs–style light syntax colors */
export const TOKEN_COLORS = {
  keyword: { red: 0.102, green: 0.251, blue: 0.725 }, // #1a73e8
  string: { red: 0.075, green: 0.451, blue: 0.2 }, // #137333
  number: { red: 0.098, green: 0.373, blue: 0.651 },
  comment: { red: 0.42, green: 0.447, blue: 0.502 },
  property: { red: 0.133, green: 0.345, blue: 0.667 },
  function: { red: 0.486, green: 0.227, blue: 0.929 },
  operator: { red: 0.259, green: 0.259, blue: 0.259 },
  punctuation: { red: 0.259, green: 0.259, blue: 0.259 },
  flag: { red: 0.102, green: 0.251, blue: 0.725 },
  url: { red: 0.102, green: 0.451, blue: 0.910 },
};

const TS_KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
  "function",
  "async",
  "await",
  "return",
  "if",
  "else",
  "for",
  "of",
  "in",
  "while",
  "try",
  "catch",
  "throw",
  "new",
  "class",
  "extends",
  "implements",
  "interface",
  "type",
  "enum",
  "default",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "typeof",
  "instanceof",
  "as",
  "switch",
  "case",
  "break",
  "continue",
  "do",
  "yield",
  "readonly",
  "private",
  "public",
  "protected",
]);

const JS_KEYWORDS = TS_KEYWORDS;

const SHELL_KEYWORDS = new Set([
  "if",
  "then",
  "else",
  "fi",
  "for",
  "do",
  "done",
  "in",
  "case",
  "esac",
  "export",
  "local",
  "function",
  "return",
  "exit",
  "echo",
  "cd",
  "mkdir",
  "npm",
  "node",
  "npx",
  "git",
  "curl",
  "wget",
  "ollama",
  "docker",
]);

function pushToken(tokens, text, type) {
  if (!text) return;
  const last = tokens.at(-1);
  if (last && last.type === type) {
    last.text += text;
    return;
  }
  tokens.push({ text, type: type ?? "plain" });
}

function highlightLine(line, docsLang) {
  const tokens = [];

  if (docsLang === "JSON") {
    let i = 0;
    while (i < line.length) {
      const rest = line.slice(i);
      if (/^\s+/.test(rest)) {
        pushToken(tokens, rest.match(/^\s+/)[0], "plain");
        i += rest.match(/^\s+/)[0].length;
        continue;
      }
      if (/^"(?:\\.|[^"\\])*"/.test(rest)) {
        const m = rest.match(/^"(?:\\.|[^"\\])*"/)[0];
        pushToken(tokens, m, "string");
        i += m.length;
        continue;
      }
      if (/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.test(rest)) {
        const m = rest.match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/)[0];
        pushToken(tokens, m, "number");
        i += m.length;
        continue;
      }
      if (/^(true|false|null)\b/.test(rest)) {
        const m = rest.match(/^(true|false|null)/)[0];
        pushToken(tokens, m, "keyword");
        i += m.length;
        continue;
      }
      pushToken(tokens, rest[0], "plain");
      i++;
    }
    return tokens;
  }

  if (docsLang === "SHELL") {
    let i = 0;
    while (i < line.length) {
      const rest = line.slice(i);
      if (/^\s+/.test(rest)) {
        pushToken(tokens, rest.match(/^\s+/)[0], "plain");
        i += rest.match(/^\s+/)[0].length;
        continue;
      }
      if (/^#.*$/.test(rest)) {
        pushToken(tokens, rest, "comment");
        break;
      }
      if (/^"(?:\\.|[^"\\])*"/.test(rest) || /^'(?:\\.|[^'\\])*'/.test(rest)) {
        const m = rest.match(/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/)[0];
        pushToken(tokens, m, "string");
        i += m.length;
        continue;
      }
      if (/^https?:\/\/[^\s]+/.test(rest)) {
        const m = rest.match(/^https?:\/\/[^\s]+/)[0];
        pushToken(tokens, m, "url");
        i += m.length;
        continue;
      }
      if (/^--?[a-zA-Z][\w-]*/.test(rest)) {
        const m = rest.match(/^--?[a-zA-Z][\w-]*/)[0];
        pushToken(tokens, m, "flag");
        i += m.length;
        continue;
      }
      if (/^[A-Za-z_][\w]*/.test(rest)) {
        const m = rest.match(/^[A-Za-z_][\w]*/)[0];
        pushToken(tokens, m, SHELL_KEYWORDS.has(m) ? "keyword" : "plain");
        i += m.length;
        continue;
      }
      if (/^[|;&<>]/.test(rest)) {
        pushToken(tokens, rest[0], "operator");
        i++;
        continue;
      }
      pushToken(tokens, rest[0], "plain");
      i++;
    }
    return tokens;
  }

  if (docsLang === "TYPESCRIPT" || docsLang === "JAVASCRIPT") {
    let i = 0;
    const keywords = docsLang === "TYPESCRIPT" ? TS_KEYWORDS : JS_KEYWORDS;
    while (i < line.length) {
      const rest = line.slice(i);
      if (/^\s+/.test(rest)) {
        pushToken(tokens, rest.match(/^\s+/)[0], "plain");
        i += rest.match(/^\s+/)[0].length;
        continue;
      }
      if (/^\/\/.*$/.test(rest)) {
        pushToken(tokens, rest, "comment");
        break;
      }
      if (/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/.test(rest)) {
        const m = rest.match(/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/)[0];
        pushToken(tokens, m, "string");
        i += m.length;
        continue;
      }
      if (/^-?\d+(?:\.\d+)?/.test(rest)) {
        const m = rest.match(/^-?\d+(?:\.\d+)?/)[0];
        pushToken(tokens, m, "number");
        i += m.length;
        continue;
      }
      if (/^[A-Za-z_$][\w$]*/.test(rest)) {
        const m = rest.match(/^[A-Za-z_$][\w$]*/)[0];
        const next = rest.slice(m.length);
        let type = keywords.has(m) ? "keyword" : "plain";
        if (type === "plain" && /^\s*\(/.test(next)) type = "function";
        if (type === "plain" && /^[A-Z]/.test(m)) type = "property";
        pushToken(tokens, m, type);
        i += m.length;
        continue;
      }
      if (/^[{}()[\].,:;=<>!&|+\-*/?]/.test(rest)) {
        pushToken(tokens, rest[0], "punctuation");
        i++;
        continue;
      }
      pushToken(tokens, rest[0], "plain");
      i++;
    }
    return tokens;
  }

  pushToken(tokens, line, "plain");
  return tokens;
}

export function highlightCode(source, markdownLang) {
  const docsLang = mapDocsLanguage(markdownLang, source);
  const tokens = [];
  const lines = source.split("\n");
  for (let li = 0; li < lines.length; li++) {
    if (li > 0) pushToken(tokens, "\n", "plain");
    tokens.push(...highlightLine(lines[li], docsLang));
  }
  return { docsLang, tokens };
}

export function tokensToPlainAndSpans(tokens) {
  let plain = "";
  const spans = [];
  for (const token of tokens) {
    const start = plain.length;
    plain += token.text;
    if (token.type && token.type !== "plain" && TOKEN_COLORS[token.type]) {
      spans.push({ start, end: plain.length, color: TOKEN_COLORS[token.type] });
    }
  }
  return { plain, spans };
}
