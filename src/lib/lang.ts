import { lex } from "./lex";

export type Stmt =
  | { kind: "pack"; qty: number; sku: string }
  | { kind: "scrap"; qty: number; sku: string; stage: string }
  | { kind: "move"; batch: string; stage: string }
  | { kind: "stock"; dir: "in" | "out"; qty: number; unit: string; material: string };

export type Move =
  | { kind: "finished-in"; sku: string; qty: number }
  | { kind: "scrap"; sku: string; qty: number; stage: string }
  | { kind: "advance"; batch: string; stage: string }
  | { kind: "material"; dir: "in" | "out"; material: string; qty: number; unit: string };

export function parse(src: string): Stmt[] {
  const toks = lex(src);
  let i = 0;
  const stmts: Stmt[] = [];
  while (i < toks.length) stmts.push(statement());
  return stmts;

  function statement(): Stmt {
    const w = word();
    if (w === "PACK") return { kind: "pack", qty: number(), sku: expectWord("OF") && ident() };
    if (w === "SCRAP") {
      const qty = number();
      expectWord("OF");
      const sku = ident();
      expectWord("AT");
      return { kind: "scrap", qty, sku, stage: ident() };
    }
    if (w === "MOVE") {
      const batch = ident();
      expectWord("TO");
      return { kind: "move", batch, stage: ident() };
    }
    if (w === "IN" || w === "OUT") {
      const qty = number();
      const unit = ident();
      return { kind: "stock", dir: w === "IN" ? "in" : "out", qty, unit, material: ident() };
    }
    throw new Error(`unknown statement ${w}`);
  }

  function word(): string {
    const t = toks[i];
    if (!t || t.kind !== "word") throw new Error(`expected a keyword at ${t?.at ?? src.length}`);
    i += 1;
    return t.text;
  }

  function expectWord(w: string): true {
    const t = toks[i];
    if (!t || t.kind !== "word" || t.text !== w) throw new Error(`expected ${w}`);
    i += 1;
    return true;
  }

  function ident(): string {
    const t = toks[i];
    if (!t || t.kind !== "ident") throw new Error(`expected a name at ${t?.at ?? src.length}`);
    i += 1;
    return t.text;
  }

  function number(): number {
    const t = toks[i];
    if (!t || t.kind !== "number") throw new Error(`expected a number at ${t?.at ?? src.length}`);
    i += 1;
    return t.value;
  }
}

export function emit(stmts: Stmt[]): Move[] {
  return stmts.map((s) => {
    if (s.kind === "pack") return { kind: "finished-in", sku: s.sku, qty: s.qty };
    if (s.kind === "scrap") return { kind: "scrap", sku: s.sku, qty: s.qty, stage: s.stage };
    if (s.kind === "move") return { kind: "advance", batch: s.batch, stage: s.stage };
    return { kind: "material", dir: s.dir, material: s.material, qty: s.qty, unit: s.unit };
  });
}

export function run(src: string): { ast: Stmt[]; moves: Move[] } {
  const ast = parse(src);
  return { ast, moves: emit(ast) };
}
