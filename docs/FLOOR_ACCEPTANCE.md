# Floor acceptance checklist

Use this checklist on the actual museum PCs, touchscreens, speakers, and network.

## Before the room opens

- Run `npm run build` and `npm run test:e2e`.
- Run `npm run audit:media`. Missing concrete assets must be zero.
- Run `npm run audit:media:strict` before final media lock; every remaining
  placeholder must be deliberately replaced or waived.
- Confirm every PC launches Welcome, then have staff open the intended area for
  each TV. Guests must still be able to move freely between exhibits.
- Confirm browser zoom is 100%, Windows display scaling is documented, and the
  kiosk viewport has no taskbar, address bar, or browser scrollbars.

## Touch and interaction walk

- Touch every primary control at the corners and centre of each display.
- Welcome: open every atlas habitat and every gallery station.
- Forest: open all six animals, full profiles, Compare, Tracks, and calls.
- Night: hold the beam still over a creature and confirm discovery completes;
  verify Explore by list without dragging.
- Water: drag from shoreline to river bottom and use every zone shortcut.
- Sky: swipe both directions, use look-left/right, select each bird, and open
  every activity.
- Seasons: tap and drag through all four seasons; follow an animal through the
  year.
- Tracks: answer several clue types, open the animal profile, and advance.
- Coexistence: confirm only the approved stewardship scenarios appear.

## Audio and accessibility

- Audio never autoplays after boot or reset.
- Muting, profile close, idle attract, and Restart stop all playing audio.
- Missing audio says “Audio unavailable”; it must not expose install language.
- Reduced-motion mode keeps every activity usable.
- All controls meet the minimum touch target and visible focus requirements.

## Soak

Run from the installed build:

```powershell
.\deploy\windows\Test-KioskSoak.ps1 -Hours 8 -IntervalSeconds 60
```

The CSV log is written to `deploy/windows/logs/kiosk-soak.csv`. A floor-ready
run has zero route failures, no browser crash/restart loop, stable touch input,
and no sustained memory climb across the day.

## Sign-off

- Content / curator:
- Wildlife authority review (Coexistence):
- Media rights / attribution:
- Accessibility:
- Technical / kiosk:
- Date and build commit:
