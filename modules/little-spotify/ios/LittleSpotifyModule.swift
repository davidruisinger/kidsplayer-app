import ExpoModulesCore
import SpotifyiOS

public class LittleSpotifyModule: Module {
    public func definition() -> ModuleDefinition {

        let spotifySession = LittleSpotifySessionManager.shared

        Name("LittleSpotify")

        Function("isAvailable") {
            return spotifySession.spotifyAppInstalled()
        }

        Function("togglePlay") {
            return spotifySession.togglePlay()
        }

        
        AsyncFunction("authenticateAsync") { (config: [String: Any], promise: Promise) in
            guard let scopes = config["scopes"] as? [String] else {
                promise.reject("INVALID_CONFIG", "Invalid SpotifyConfig object")
                return
            }

            let tokenSwapURL = config["tokenSwapURL"] as? String
            let tokenRefreshURL = config["tokenRefreshURL"] as? String

            spotifySession.authenticate(scopes: scopes, tokenSwapURL: tokenSwapURL, tokenRefreshURL: tokenRefreshURL).done { session in
                promise.resolve([
                    "accessToken": session.accessToken,
                    "refreshToken": session.refreshToken,
                    "expirationDate": Int(session.expirationDate.timeIntervalSince1970 * 1000),
                    "scopes": SPTScopeSerializer.serializeScopes(session.scope)
                ])
            }.catch { error in
                promise.reject(error)
            }
        }
    }
}
