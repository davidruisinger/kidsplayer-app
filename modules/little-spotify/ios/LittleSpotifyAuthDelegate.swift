import ExpoModulesCore
import SpotifyiOS

public class LittleSpotifyAuthDelegate: ExpoAppDelegateSubscriber {
    let sessionManager = LittleSpotifySessionManager.shared
    
    public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        if let canHandleURL = sessionManager.sessionManager?.application(app, open: url, options: options) {
            return canHandleURL
        }
        return false
    }
    
    public func applicationWillResignActive(_ application: UIApplication) {
        if (sessionManager.appRemote?.isConnected ?? false) {
            sessionManager.appRemote?.disconnect()
        }
    }

    public func applicationDidBecomeActive(_ application: UIApplication) {
        if let _ = sessionManager.appRemote?.connectionParameters.accessToken {
            sessionManager.appRemote?.connect()
        }
    }
}
