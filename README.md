# MTG Cube Draft Pack Generator

Generate legal Magic: The Gathering cube draft packs from a CSV export or a Cube Cobra link.

## Features

- Load cube via **CSV** or **Cube Cobra** URL
- Configurable pack counts (non-land commons, uncommons, rares/mythics)
- Fixed pack size with **one land slot** (33% cube common land if available, otherwise a random basic)
- Pack rules: ≥2 mono of each colour (WUBRG), no duplicate names, exact rarity counts
- Seeded RNG for reproducible deals
- Pool report, deal info (including failure reasons), leftover pool with filters
- Optional Scryfall image preload (cached in the browser)
- Print layout (3×3 packs per page)
- PWA shell (installable when served over `http://localhost` or HTTPS)

## Run locally

Serve this folder (do not open as `file://` if you want PWA install):

```bash
python -m http.server 8080
```

Then open [http://localhost:8080/mtg-cube-pack-generator.html](http://localhost:8080/mtg-cube-pack-generator.html).

## Files

| File | Role |
|------|------|
| `mtg-cube-pack-generator.html` | Main app (HTML/CSS/JS) |
| `index.html` | Redirect to the app |
| `manifest.webmanifest` | PWA manifest |
| `sw.js` | Service worker (app shell cache) |
| `icons/` | App icons |

## Notes

- Pack generation is fully local after the cube is loaded.
- Cube Cobra import and Scryfall preload need network access when used.
- Card images are stored in IndexedDB on the device when preloaded.
