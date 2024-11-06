"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSpotifyQueryScheme = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const SPOTIFY_SCHEME = "spotify";
const withSpotifyQueryScheme = (config) => (0, config_plugins_1.withInfoPlist)(config, (config) => {
    if (!config.modResults.LSApplicationQueriesSchemes) {
        config.modResults.LSApplicationQueriesSchemes = [];
    }
    if (!config.modResults.LSApplicationQueriesSchemes.includes(SPOTIFY_SCHEME)) {
        config.modResults.LSApplicationQueriesSchemes.push(SPOTIFY_SCHEME);
    }
    return config;
});
exports.withSpotifyQueryScheme = withSpotifyQueryScheme;
