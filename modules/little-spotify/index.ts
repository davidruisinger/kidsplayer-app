import { SpotifyConfig, SpotifySession } from "./src/LittleSpotify.types";
import LittleSpotify from "./src/LittleSpotifyModule";

function isAvailable(): boolean {
  return LittleSpotify.isAvailable();
}

function authenticateAsync(config: SpotifyConfig): Promise<SpotifySession> {
  if (!config.scopes || config.scopes?.length === 0) {
    throw new Error("scopes are required");
  }

  return LittleSpotify.authenticateAsync(config);
}

function togglePlay(): void {
  LittleSpotify.togglePlay();
}

export { isAvailable, authenticateAsync, togglePlay };
