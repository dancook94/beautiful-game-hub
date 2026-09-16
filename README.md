# The Beautiful Game Hub

Premium dark football fan site. No shop, no checkout — just floodlights, a live ticker, and a terrace that never clocks off.

## Stack

- Next.js App Router
- Tailwind CSS + shadcn/ui
- `react-simple-maps` + `world-atlas` (110m countries)
- Mock APIs at `/api/live-scores` and `/api/predictions`

## Theme

- Charcoal `#0a0f0a`
- Pitch green `#00A86B`
- Cream text `#f4efe4`
- Inter + Space Grotesk

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Notes

Live scores and the prediction board are mocked. Picks persist in `localStorage` under `bgh-predictions`.
