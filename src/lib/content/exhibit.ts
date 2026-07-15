import type { ExhibitContent, Scene, SceneId } from "@/types/content";

export function getHomeScene(exhibit: ExhibitContent): Scene | undefined {
  return exhibit.scenes.find((scene) => scene.id === exhibit.homeSceneId);
}

export function getScene(exhibit: ExhibitContent, sceneId: SceneId): Scene | undefined {
  return exhibit.scenes.find((scene) => scene.id === sceneId);
}

export function getExhibitTimeoutMs(
  exhibit: ExhibitContent,
  globalTimeoutMs: number,
): number {
  return exhibit.idle?.timeoutMs ?? globalTimeoutMs;
}
