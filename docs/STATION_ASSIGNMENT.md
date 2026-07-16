# Station assignment

One application build runs on all museum screens. Guests may freely open any
`/exhibit/*` destination. Workers choose which area each TV shows.

## Station IDs

| ID | Label | Route |
|----|-------|-------|
| `welcome` | Welcome (shared home) | `/exhibit/welcome` |
| `forest` | Giants of the Forest | `/exhibit/forest` |
| `water` | Life Beneath the Water | `/exhibit/water` |
| `sky` | Wings of the North | `/exhibit/sky` |
| `night` | The Forest After Dark | `/exhibit/night` |
| `seasons` | Four Seasons of Survival | `/exhibit/seasons` |
| `tracks` | Tracks, Calls and Clues | `/exhibit/tracks` |
| `coexistence` | Living Together | `/exhibit/coexistence` |

Defined in `src/content/config/stations.ts`.

## Recommended floor ops

1. **Cold start — same place** — Autostart every TV to Welcome (`Launch-Station.ps1 -Station forest` without `-Direct`, or open `/` / `/exhibit/welcome`).
2. **Worker loads areas** — On each TV, open that display’s exhibit (`-Direct`, staff panel, or navigate to `/exhibit/{id}` / `/?station={id}`).
3. **Guests play freely** — No cross-station lock. Welcome’s “Explore the room” and in-exhibit links may open any station.

## Assignment methods (optional memory)

1. **Direct exhibit URL** — Opening `/exhibit/forest` remembers `forest` for this PC.
2. **Query parameter** — `/?station=forest` saves and navigates to that exhibit.
3. **Persisted local storage** — Key `nomow.kiosk.station.v1`.
4. **Staff panel** — Reassign or clear; clear + `?setup=1` returns the setup screen.

Assignment is awareness for staff / restart scripts — it does **not** bounce guests away from other exhibits.

## First launch / setup

Staff setup (`/?setup=1`) lists the eight stations when you need to label a PC.
Visitors hitting `/` always open Welcome.

## Ops tips

- Shared morning boot: all screens → Welcome.
- Per-TV area: `Launch-Station.ps1 -Station forest -Direct` (or navigate after Welcome).
- Clearing assignment from the staff panel does not lock guests; use `?setup=1` only for staff labeling.
