export type Tok =
  | { kind: "word"; text: string; at: number }
  | { kind: "number"; value: number; at: number }
  | { kind: "ident"; text: string; at: number };

export function lex(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i] as string;
    if (ch === " " || ch === "\n" || ch === "\t" || ch === "\r") {
      i += 1;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < src.length && /[0-9]/.test(src[i] as string)) i += 1;
      out.push({ kind: "number", value: Number(src.slice(start, i)), at: start });
      continue;
    }
    if (/[A-Za-z-]/.test(ch)) {
      const start = i;
      while (i < src.length && /[A-Za-z0-9-]/.test(src[i] as string)) i += 1;
      const text = src.slice(start, i);
      const upper = text.toUpperCase();
      const words = ["PACK", "SCRAP", "OF", "AT", "MOVE", "TO", "IN", "OUT"];
      out.push(words.includes(upper) ? { kind: "word", text: upper, at: start } : { kind: "ident", text, at: start });
      continue;
    }
    throw new Error(`bad character '${ch}' at ${i}`);
  }
  return out;
}
