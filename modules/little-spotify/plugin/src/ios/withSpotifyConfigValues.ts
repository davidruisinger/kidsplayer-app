import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";

import { SpotifyConfig } from "../types";

interface LittleSpotifyConfig {
  [key: string]: string;
}

export const withSpotifyConfigValues: ConfigPlugin<SpotifyConfig> = (
  config,
  spotifyConfig
) =>
  withInfoPlist(config, (config) => {
    if (!config.modResults.LittleSpotify) {
      config.modResults.LittleSpotify = {};
    }

    const spotifySDKConfig = config.modResults
      .LittleSpotify as LittleSpotifyConfig;

    Object.entries(spotifyConfig).forEach(([key, value]) => {
      spotifySDKConfig[key] = value;
    });

    return config;
  });
