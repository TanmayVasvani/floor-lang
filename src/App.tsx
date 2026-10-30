import { useState } from "react";
import { Shell } from "./components/shell";
import { run } from "./lib/lang";

const SAMPLE = `PACK 500 OF ZEC-PRO
SCRAP 12 OF ZEC-PRO AT TUFTING
MOVE B-0708-01 TO PACKING
IN 40 KG PP
OUT 2 ROLL BLISTER`;

export function App() {
  const [src, setSrc] = useState(SAMPLE);
  const [out, setOut] = useState<ReturnType<typeof run> | { error: string }>(() => run(SAMPLE));

  function go(text = src) {
    try {
      setOut(run(text));
    } catch (e) {
      setOut({ error: e instanceof Error ? e.message : "error" });
    }
  }

  return (
    <Shell project="Floor">
      <header className="max-w-3xl">
        <p className="text-xs tracking-widest text-teal uppercase">A small language for the floor</p>
        <h1 className="mt-2 text-4xl md:text-5xl">PACK 500 OF ZEC-PRO</h1>
        <p className="mt-4 text-muted md:text-lg">
          Lexer, parser, AST, and the stock moves that statement emits. A missing OF is an error, not a guess.
        </p>
      </header>
      <textarea
        className="mt-6 w-full border border-line bg-paper p-3 font-mono text-sm"
        rows={7}
        value={src}
        onChange={(e) => setSrc(e.target.value)}
      />
      <button className="mt-3 border border-ink bg-ink px-4 py-2 text-paper" onClick={() => go()}>
        Run
      </button>
      {"error" in out ? <p className="mt-4 text-rust">{out.error}</p> : null}
      {"moves" in out ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl">AST</h2>
            <pre className="mt-3 overflow-x-auto text-sm">{JSON.stringify(out.ast, null, 2)}</pre>
          </section>
          <section>
            <h2 className="text-2xl">Moves</h2>
            <ul className="mt-3 text-sm">
              {out.moves.map((m, i) => (
                <li key={i} className="border-t border-line py-2 font-mono">
                  {JSON.stringify(m)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </Shell>
  );
}
