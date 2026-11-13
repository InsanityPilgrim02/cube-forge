# MTG Cube Draft Pack Generator

Generate legal Magic: The Gathering cube draft packs from a CSV export or a [Cube Cobra](https://cubecobra.com) link.

**Live source:** [github.com/InsanityPilgrim02/mtg-cube-pack-generator](https://github.com/InsanityPilgrim02/mtg-cube-pack-generator)

## Features

- Load a cube via **CSV** or **Cube Cobra** URL
- Configurable pack counts (non-land commons, uncommons, rares/mythics)
- Fixed pack size with **one land slot** (33% chance of a cube common land if available, otherwise a random basic)
- Pack rules: at least 2 mono of each colour (WUBRG), no duplicate names, exact rarity counts
- Seeded RNG for reproducible deals
- Pool report, deal info (including failure reasons), leftover pool with filters
- Optional Scryfall image preload (stored in the browser)
- Print layout (3×3 packs per page)
- PWA shell (installable when served over `http://localhost` or HTTPS)

## Run locally

Serve this folder (do not open as `file://` if you want PWA install):

```bash
python -m http.server 8080
```

Then open:

[http://localhost:8080/mtg-cube-pack-generator.html](http://localhost:8080/mtg-cube-pack-generator.html)

Or open [http://localhost:8080/](http://localhost:8080/) — `index.html` redirects to the app.

## How to use

1. **Load cube** — CSV (browse/drop) or paste a Cube Cobra list URL / ID.
2. If the CSV has no quantity column, set copies per rarity and apply.
3. Optionally **Preload card images** (Scryfall; saves to device cache).
4. Set pack count, commons / uncommons / rares, and optional seed.
5. **Generate Packs** — re-rolls until all packs are legal (or reports why it failed).
6. Review leftovers, copy/download, or print.

## Pack rules

Each pack aims for:

- Exact non-land common / uncommon / rare–mythic counts as configured
- **One land slot:** 33% cube common land (if any remain), else a random basic (Plains, Island, Swamp, Mountain, Forest)
- At least **2 mono-colour** cards of each of W, U, B, R, G (multicolour, colourless, and basics do not count)
- No duplicate card names in a pack
- Cube quantities never exceeded

Invalid deals are re-rolled (up to 100 attempts).

## Files

| File | Role |
|------|------|
| `mtg-cube-pack-generator.html` | Main app (HTML, CSS, JS) |
| `index.html` | Redirect to the app |
| `manifest.webmanifest` | PWA manifest |
| `sw.js` | Service worker (app shell cache) |
| `icons/` | App icons |

## Notes

- Pack generation is fully local after the cube is loaded.
- Cube Cobra import and Scryfall preload need network access when used.
- Preloaded card images are stored in IndexedDB on the device; you can clear them from the app UI.
- Prefer Cube Cobra import (or accurate mana-cost / type columns) when CSV colour tags are unreliable.
