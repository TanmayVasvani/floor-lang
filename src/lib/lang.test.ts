import { describe, expect, it } from "vitest";
import { run } from "./lang";

const SRC = `PACK 500 OF ZEC-PRO
SCRAP 12 OF ZEC-PRO AT TUFTING
MOVE B-0708-01 TO PACKING
IN 40 KG PP
OUT 2 ROLL BLISTER`;

describe("floor", () => {
  it("emits a move for each statement", () => {
    const { moves } = run(SRC);
    expect(moves).toEqual([
      { kind: "finished-in", sku: "ZEC-PRO", qty: 500 },
      { kind: "scrap", sku: "ZEC-PRO", qty: 12, stage: "TUFTING" },
      { kind: "advance", batch: "B-0708-01", stage: "PACKING" },
      { kind: "material", dir: "in", material: "PP", qty: 40, unit: "KG" },
      { kind: "material", dir: "out", material: "BLISTER", qty: 2, unit: "ROLL" },
    ]);
  });

  it("rejects a missing keyword", () => {
    expect(() => run("PACK 10 ZEC-PRO")).toThrow(/OF/);
  });
});
