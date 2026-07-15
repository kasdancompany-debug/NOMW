# Station assignment

One application build runs on all eight museum screens. Each physical display is locked to one station via local assignment.

## Station IDs

| ID | Label | Route |
|----|-------|-------|
| `welcome` | Station 1 — Welcome | `/exhibit/welcome` |
| `forest` | Station 2 — Giants of the Forest | `/exhibit/forest` |
| `water` | Station 3 — Life Beneath the Water | `/exhibit/water` |
| `sky` | Station 4 — Wings of the North | `/exhibit/sky` |
| `night` | Station 5 — The Forest After Dark | `/exhibit/night` |
| `seasons` | Station 6 — Four Seasons of Survival | `/exhibit/seasons` |
| `tracks` | Station 7 — Tracks, Calls and Clues | `/exhibit/tracks` |
| `coexistence` | Station 8 — Living Together | `/exhibit/coexistence` |

Defined in `src/content/config/stations.ts`.

## Assignment methods

1. **Direct exhibit URL** — Opening `/exhibit/forest` on an unassigned PC saves `forest` and stays there.
2. **Query parameter** — `/?station=forest` (or any page with `?station=forest`) saves and navigates to that exhibit.
3. **Persisted local storage** — Key `nomow.kiosk.station.v1`. Survives refresh and restarts.
4. **Staff panel** — Authenticated technicians can reassign or clear the assignment.

## First launch

If the PC has **no** assignment and loads `/`:

- A **staff-only setup screen** lists the eight stations.
- Selecting one saves locally and opens that exhibit.
- Visitors never see this screen afterward.

## Navigation lock

Casual movement between exhibits is blocked unless `ExhibitConfig.allowedNavigation.allowedPaths` explicitly allows another path. Each station defaults to only its own `/exhibit/{id}` (plus `/staff`).

## Ops tips

- Autostart each browser to `/` (setup once) or directly to `/exhibit/{id}` / `/?station={id}`.
- Clearing local settings from the staff panel also clears station assignment and returns to setup.
