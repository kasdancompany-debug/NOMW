# Accessibility — Northern Ontario Museum of Wonder

Public touchscreen installation guidance for eight landscape kiosks (1920×1080). Accessibility is woven into the primary visual language — larger type, stronger contrast, clearer press states — **not** a separate “ugly a11y mode.”

Related: `KIOSK_REQUIREMENTS.md`, `CONTENT_MODEL.md`, `MEDIA_GUIDELINES.md`.

---

## Implemented accommodations

### High text contrast

- Dark installation surfaces use `--text-on-dark` (`#f3efe6`) on night/deep-lake backgrounds.
- Supporting copy uses an elevated muted token (`--color-fg-muted` / `--text-on-dark-muted`) sized for standing viewing distance.
- Scrim utilities (`.text-scrim`, `.text-scrim-strong`) keep type readable over photography.
- Quiet / secondary controls use full on-dark text (not faint gray).

### Large text

- Body default **18px+**; lead and display scales use fluid clamps for kiosk distance.
- Visitor chrome prefers `--text-label` / `--text-body-sm` over micro type; micro is reserved for staff / secondary notes.

### Large touch targets

- Minimum hit area **64×64px** (`--touch-min`); primary CTAs use 72px+ (`touch-target-md`).
- Shared `Touchable` / `LargeTouchButton` / `QuietButton` enforce the floor.
- Season chips, sky bird pickers, night trail, and quizzes target ≥64px height.

### Captions for meaningful audio

- `ListenControl` always shows a **Caption:** line beside Listen — audio is optional.
- Forest animal calls use the same pattern (`AnimalCallButton`).
- Sky “Whose Call” is caption-first; Listen is optional.
- Call / video `caption` + optional WebVTT `captionsSrc` live on media models.
- Playing / **Sound off** indicators use text + color (never sound alone).

### Text alternatives for essential imagery

- `LocalImage` resolves `alt` → asset `alt` → staff `label`.
- Decorative beds may use empty alt / `aria-hidden` when meaning is carried in adjacent copy.
- Track quiz art exposes `aria-label` from the written clue.
- Soft `MediaFallback` avoids broken-image icons when files are missing.

### Reduced-motion mode

- Honours OS `prefers-reduced-motion` and staff **Reduced motion** override.
- `ReducedMotionDocumentSync` sets `data-reduced-motion="true"` on `<html>` so CSS ambient animations match JS.
- Framer Motion scenic loops, press bloom, and success pulses soften or stop.
- Night / sky keep exploration via **tap alternatives** when drag motion is disabled.

### No colour-only instructions

- Quiz outcomes use copy (“Yes…”, “Not quite…”) plus soft highlight.
- Correct options gain a **Match** / **A caring choice** text badge — not teal alone.
- Soft miss styling may use line-through **and** explanation text.

### Clear active states

- Press feedback on `Touchable` (`data-pressed`, glow, brightness) — no hover-only cues.
- Selected birds, seasons, mute, and night controls use `aria-pressed` where relevant.
- Focus-visible outline uses `--color-focus` for keyboard / QA path.

### Simple language & limited text density

- Short introductions and progressive “Learn more” / “A little more” disclosure.
- Leads typically capped (~36–42ch) for standing visitors.
- Coexistence scenarios: situation → few choices → one explanation.

### Timed interactions that can be restarted

- Idle timeout shows a warning with **Keep exploring**; soft reset returns to a clean attract / home.
- Quizzes include **Try again** after a reveal (not idle-only restart).
- Hold-to-confirm (staff) shows progress and can be abandoned by releasing.
- Night completion overlay is dismissible; list explore remains available.

### Visible mute state

- Global shell **Sound on / Sound off** control with warm ring when muted.
- Local PlayingIndicator and Night sound control repeat mute / optional wording.

### Drag + tap alternatives

| Interaction | Drag / gesture | Tap alternative |
|-------------|----------------|-----------------|
| Forest carousel | Swipe | Progress dots |
| Sky panorama | Horizontal drag | **Look left / Look right** + bird name chips |
| Tracks challenges | Drag to place | Tap piece, then tap zone |
| Seasons | Drag timeline | Season labels / wheel taps |
| Night discovery | Flashlight drag | **Explore by list** (auto for reduced motion) |

### Avoid rapid flashing

- Scenic motion is slow (multi-second ambient).
- Success / miss feedback is brief and soft; suppressed under reduced motion.
- No strobing correctness lights; pulse dots are optional and RM-gated.

---

## Staff tools

- Staff panel: force reduced motion on / off / follow system.
- Diagnostics: media load status (offline indicator is staff-only — see `OFFLINE_DEPLOYMENT.md`).
- Clear local settings resets visitor preference overrides on that station.

---

## Remaining limitations

| Area | Limitation | Mitigation / next step |
|------|------------|-------------------------|
| Caption VTT files | Few authored WebVTT tracks yet; meaning often uses on-screen caption strings | Author VTT for final video beds; keep string captions |
| Call descriptions | Some catalog `callDescription` fields still mark research placeholders | Curator pass to replace `[NEEDS RESEARCH]` with visitor-safe captions |
| Decorative media alts | Empty alt is allowed for beds; authors can still omit alt on essential stills | Content QA checklist before floor lock |
| Colour contrast on glass | Heavy glass + warm muted combinations can slip under AA if copy drifts light | Keep scrims; avoid pale type on pale mist |
| Keyboard / AT outside kiosk | Product is touch-first capacitive glass; keyboard is QA-oriented | Maintain focus-visible; not a full desktop AT surface |
| Screen readers | Not the primary visitor path in a noisy gallery | Labels/captions help; do not rely on SR alone on the floor |
| Idle timeout | Shared floor budget (~90s default) still resets the session | Warning + Keep exploring; staff can lengthen timeout |
| Hold-to-confirm + RM | Reduced motion may instant-complete holds (except staff ignore flag) | Prefer non-destructive defaults; staff uses hold deliberately |
| Night flashlight | Drag beam remains primary cinematic mode | List explore is always one tap away |
| Indigenous names | Placeholders until community consultation | Never invent spellings — see content model |

---

## Floor QA checklist

1. Read lead copy at ~arm’s length — contrast and type size feel comfortable.
2. With gloves / less precise touch: hit Sound, Listen, quiz chips, Look left/right.
3. Mute the station — every listening surface still shows captions / Sound off.
4. Enable reduced motion (OS or staff) — sky pans by buttons; night works via list; no ambient thrash.
5. Complete a quiz miss, then **Try again**.
6. Disconnect audio files — exhibit remains understandable via captions and fallbacks.
7. Confirm no instruction depends on colour alone.

---

## For content authors

- Keep visitor sentences short; put depth behind “Learn more.”
- Every Listen surface needs a human-readable caption that stands alone.
- Non-decorative images need meaningful `alt` (or a visible caption that carries the same idea).
- Prefer soft instructional verbs: “Choose…”, “Touch…”, “Listen if you like…” — not shame or urgency.
