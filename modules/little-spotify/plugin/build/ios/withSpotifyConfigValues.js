"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSpotifyConfigValues = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withSpotifyConfigValues = (config, spotifyConfig) =>
  (0, config_plugins_1.withInfoPlist)(config, (config) => {
    if (!config.modResults.LittleSpotify) {
      config.modResults.LittleSpotify = {};
    }
    const spotifySDKConfig = config.modResults.LittleSpotify;
    Object.entries(spotifyConfig).forEach(([key, value]) => {
      spotifySDKConfig[key] = value;
    });
    return config;
  });
exports.withSpotifyConfigValues = withSpotifyConfigValues;
