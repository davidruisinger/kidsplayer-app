"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSpotifyURLScheme = void 0;
const config_plugins_1 = require("expo/config-plugins");
const withSpotifyURLScheme = (config, { scheme }) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const bundleId = config.ios?.bundleIdentifier;
        const urlType = {
            CFBundleURLName: bundleId,
            CFBundleURLSchemes: [scheme],
        };
        if (!config.modResults.CFBundleURLTypes) {
            config.modResults.CFBundleURLTypes = [];
        }
        config.modResults.CFBundleURLTypes.push(urlType);
        return config;
    });
};
exports.withSpotifyURLScheme = withSpotifyURLScheme;
