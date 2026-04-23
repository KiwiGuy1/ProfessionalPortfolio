const MODEL_CACHE_VERSION = "2026-04-23-v2";

export const KIWI_MODEL_PATHS = [
  "/model.glb",
  "/model12.glb",
  "/model6.glb",
  "/mode1l.glb",
].map((path) => `${path}?v=${MODEL_CACHE_VERSION}`);

export const KIWI_MODEL_PATH = KIWI_MODEL_PATHS[0];
