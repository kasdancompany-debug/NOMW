# Local exhibit analytics

Privacy-conscious aggregate analytics for kiosk stations. Counts and content IDs only — never visitor identity.

## What is recorded

| Event | Notes |
|-------|--------|
| `session_started` | Attract exit / first engagement (`beginSession`) |
| `attract_exited` | Visitor left attract mode |
| `animal_profile_opened` | Animal ID only |
| `fact_expanded` | Counter (+ optional animal ID) |
| `audio_played` | Totals; call ranking uses call-role IDs only |
| `video_played` | Media/content ID |
| `challenge_started` / `challenge_completed` | Activity ID (+ optional `correct` flag) |
| `inactivity_reset` | Soft reset from idle timeout |
| `application_error` / `media_error` | Counters (+ media kind/id for media) |

## What is never recorded

Names, faces, photos, precise visitor identity, free-form text answers, personal information, or advertising identifiers.

## Storage

- Key: `nomow.kiosk.analytics.v1` (this browser / station only)
- Staff panel → **Analytics**: summary, Export JSON, Clear analytics
- “Clear local settings” also wipes this key

## Replaceable service

Default: `LocalAnalyticsService` via `getAnalytics()`.

```ts
import { setAnalyticsService, type AnalyticsService } from "@/lib/analytics";

setAnalyticsService(myMuseumLocalServerAdapter);
```

Implement `AnalyticsService` in `src/types/analytics.ts` to forward aggregates to a museum-local server later without changing exhibit instrumentation.
