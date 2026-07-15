export { mediaUrl, indexMedia, resolveMedia } from "@/lib/media/paths";
export {
  KIOSK_IMAGE_SIZES,
  DEFAULT_VIDEO_PRELOAD,
  DEFAULT_AUDIO_ONESHOT_PRELOAD,
  DEFAULT_AUDIO_AMBIENT_PRELOAD,
  MEDIA_FALLBACK_DATA_URI,
} from "@/lib/media/config";
export {
  asLocalMedia,
  imageSrcSet,
  resolveImageSrc,
  resolveVideoPoster,
  resolveCaptionText,
  resolveAttribution,
} from "@/lib/media/sources";
export { localAudioManager, silenceStationAudio } from "@/lib/media/audioManager";
export { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
