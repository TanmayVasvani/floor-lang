# Floor

A small language for the factory floor. A statement becomes a stock move.

**Live:** https://tanmayvasvani.github.io/floor-lang/ · **Author:** Tanmay Vaswani

```
PACK 500 OF ZEC-PRO
SCRAP 12 OF ZEC-PRO AT TUFTING
MOVE B-0708-01 TO PACKING
IN 40 KG PP
OUT 2 ROLL BLISTER
```

## What it does

Lexer, recursive-descent parser, AST, and an emitter.

| Statement | Move |
|---|---|
| `PACK n OF sku` | finished goods in |
| `SCRAP n OF sku AT stage` | scrap at that stage |
| `MOVE batch TO stage` | advance the batch |
| `IN n unit material` | raw stock in |
| `OUT n unit material` | raw stock out |

A missing keyword is an error with a position. The page shows the AST and the moves.

## Run

```bash
npm install
npm test
npm run dev
npm run build
```

## Stack

TypeScript, Vite, React. The language is in `src/lib` and has no runtime dependencies.

## License

MIT
