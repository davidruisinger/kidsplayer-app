"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSpotifySdkConfig = void 0;
const withSpotifyConfigValues_1 = require("./ios/withSpotifyConfigValues");
const withSpotifyQueryScheme_1 = require("./ios/withSpotifyQueryScheme");
const withSpotifyURLScheme_1 = require("./ios/withSpotifyURLScheme");
const withSpotifySdkConfig = (config, spotifyConfig) => {
    if (!spotifyConfig.host) {
        throw new Error("Missing required Spotify config value: host");
    }
    if (!spotifyConfig.scheme) {
        throw new Error("Missing required Spotify config value: scheme");
    }
    if (!spotifyConfig.clientID) {
        throw new Error("Missing required Spotify config value: clientID");
    }
    // iOS specific
    config = (0, withSpotifyConfigValues_1.withSpotifyConfigValues)(config, spotifyConfig);
    config = (0, withSpotifyQueryScheme_1.withSpotifyQueryScheme)(config, spotifyConfig);
    config = (0, withSpotifyURLScheme_1.withSpotifyURLScheme)(config, spotifyConfig);
    return config;
};
exports.withSpotifySdkConfig = withSpotifySdkConfig;
exports.default = exports.withSpotifySdkConfig;
