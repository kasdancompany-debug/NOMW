export type {
  Animal,
  AnimalFact,
  AnimalGroup,
  AnimalId,
  ConservationStatus,
  ContentConfidence,
  ContentMeta,
  ExhibitConfiguration,
  ExhibitContent,
  ExhibitIdleConfig,
  ExhibitSlug,
  Habitat,
  HabitatId,
  Hotspot,
  HotspotRevealType,
  MediaAsset,
  MediaId,
  MediaKind,
  PlaceholderMetric,
  PlaceholderStatus,
  PlaceholderText,
  Scene,
  SceneCtaAction,
  SceneId,
  Season,
  SoundClue,
  TimeOfDay,
  TrackClue,
} from "./content";

export type {
  AttractModeContent,
  ExhibitAudioConfig,
  ExhibitBackgroundConfig,
  ExhibitConfig,
  ExhibitNavigationConfig,
  ExhibitProgressState,
} from "./exhibit-shell";

export type {
  ExhibitResetHandler,
  ExhibitSessionConfig,
  KioskHeartbeat,
  KioskSessionApi,
  KioskSessionPhase,
  KioskSettings,
} from "./kiosk-session";

export {
  DEFAULT_KIOSK_SETTINGS,
  KIOSK_HEARTBEAT_STORAGE_KEY,
  KIOSK_SETTINGS_STORAGE_KEY,
} from "./kiosk-session";

export { ANIMAL_GROUPS, EXHIBIT_SLUGS, SEASONS, isExhibitSlug } from "./content";
