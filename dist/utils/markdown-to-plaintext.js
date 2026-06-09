export function markdownToPlainText(markdown) {
    const lines = markdown.split("\n");
    const out = [];
    for (let line of lines) {
        if (line.startsWith("# ")) {
            out.push("", line.slice(2).toUpperCase(), "");
            continue;
        }
        if (line.startsWith("## ")) {
            out.push("", line.slice(3).toUpperCase(), "");
            continue;
        }
        if (line.startsWith("### ")) {
            out.push("", line.slice(4), "");
            continue;
        }
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
        line = line.replace(/\*\*([^*]+)\*\*/g, "$1");
        line = line.replace(/\*([^*]+)\*/g, "$1");
        line = line.replace(/_([^_]+)_/g, "$1");
        if (line.match(/^-\s/)) {
            line = "• " + line.slice(2);
        }
        out.push(line);
    }
    return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
//# sourceMappingURL=markdown-to-plaintext.js.map