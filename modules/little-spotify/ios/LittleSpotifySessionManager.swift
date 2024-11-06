import ExpoModulesCore
import SpotifyiOS
import PromiseKit

enum SessionManagerError: Error {
    case notInitialized
    case invalidConfiguration
}

final class LittleSpotifySessionManager: NSObject {
    weak var module: LittleSpotifyModule?
    var authPromiseSeal: Resolver<SPTSession>?

    static let shared = LittleSpotifySessionManager()

    private var littleSpotifyConfiguration: LittleSpotifyConfiguration? {
        guard let littleSpotifyDict = Bundle.main.object(forInfoDictionaryKey: "LittleSpotify") as? [String: String],
              let clientID = littleSpotifyDict["clientID"],
              let host = littleSpotifyDict["host"],
              let scheme = littleSpotifyDict["scheme"] else
        {
            return nil
        }

        return LittleSpotifyConfiguration(clientID: clientID, host: host, scheme: scheme)
    }

    lazy var configuration: SPTConfiguration? = {
        guard let clientID = littleSpotifyConfiguration?.clientID,
              let redirectURL = littleSpotifyConfiguration?.redirectURL else {
            NSLog("Invalid Spotify configuration")
            return nil
        }

        let configuration = SPTConfiguration(clientID: clientID, redirectURL: redirectURL)
        // Set the playURI to a non-nil value so that Spotify plays music after authenticating and App Remote can connect
        // otherwise another app switch will be required
        configuration.playURI = ""
        return configuration
    }()

    lazy var sessionManager: SPTSessionManager? = {
        guard let configuration = configuration else {
            return nil
        }

        return SPTSessionManager(configuration: configuration, delegate: self)
    }()
    
    lazy var appRemote: SPTAppRemote? = {
        guard let configuration = configuration else {
            return nil
        }

        let appRemote = SPTAppRemote(configuration: configuration, logLevel: .debug)
        appRemote.delegate = self
        return appRemote
    }()
    
    var lastPlayerState: SPTAppRemotePlayerState?
    
    func update(playerState: SPTAppRemotePlayerState) {
        lastPlayerState = playerState
    }
    
    func fetchPlayerState() {
        appRemote?.playerAPI?.getPlayerState({ [weak self] (playerState, error) in
            if let error = error {
                print("Error getting player state:" + error.localizedDescription)
            } else if let playerState = playerState as? SPTAppRemotePlayerState {
                self?.update(playerState: playerState)
            }
        })
    }

    func authenticate(scopes: [String], tokenSwapURL: String?, tokenRefreshURL: String?) -> PromiseKit.Promise<SPTSession> {
        return Promise { seal in
            guard let clientID = self.littleSpotifyConfiguration?.clientID,
                  let redirectURL = self.littleSpotifyConfiguration?.redirectURL else {
                NSLog("Invalid Spotify configuration")
                seal.reject(SessionManagerError.invalidConfiguration)
                return
            }
            
            let configuration = SPTConfiguration(clientID: clientID, redirectURL: redirectURL)

            if (tokenSwapURL != nil) {
                configuration.tokenSwapURL = URL(string: tokenSwapURL ?? "")
            }

            if (tokenRefreshURL != nil) {
                configuration.tokenRefreshURL = URL(string: tokenRefreshURL ?? "")
            }

            self.authPromiseSeal = seal
            self.configuration = configuration
            self.sessionManager = SPTSessionManager(configuration: configuration, delegate: self)

            DispatchQueue.main.sync {
                sessionManager?.initiateSession(with: SPTScopeSerializer.deserializeScopes(scopes), options: .default, campaign: nil)
            }
        }
    }

    func spotifyAppInstalled() -> Bool {
        guard let sessionManager = sessionManager else {
            NSLog("SPTSessionManager not initialized")
            return false
        }

        var isInstalled = false

        DispatchQueue.main.sync {
            isInstalled = sessionManager.isSpotifyAppInstalled
        }

        return isInstalled
    }

    func togglePlay() {
        guard let appRemote = appRemote else {
            NSLog("SPTAppRemote not initialized")
            return
        }
        
        if let lastPlayerState = lastPlayerState, lastPlayerState.isPaused {
            print("resume")
            appRemote.playerAPI?.resume()
            
        } else {
            print("pause")
            appRemote.playerAPI?.pause(nil)
        }
    }
}
