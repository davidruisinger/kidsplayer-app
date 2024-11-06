import Foundation
import SpotifyiOS

extension LittleSpotifySessionManager: SPTSessionManagerDelegate, SPTAppRemoteDelegate, SPTAppRemotePlayerStateDelegate {
    // MARK: - SPTSessionManagerDelegate
    
    public func sessionManager(manager _: SPTSessionManager, didInitiate session: SPTSession) {
        appRemote?.connectionParameters.accessToken = session.accessToken
        appRemote?.connect()
        authPromiseSeal?.fulfill(session)
    }
    
    public func sessionManager(manager _: SPTSessionManager, didFailWith error: Error) {
        authPromiseSeal?.reject(error)
    }
    
    public func sessionManager(manager _: SPTSessionManager, didRenew session: SPTSession) {
        authPromiseSeal?.fulfill(session)
    }
    
    // MARK: - SPTAppRemoteDelegate
    
    func appRemoteDidEstablishConnection(_ appRemote: SPTAppRemote) {
        appRemote.playerAPI?.delegate = self
        appRemote.playerAPI?.subscribe(toPlayerState: { (success, error) in
            if let error = error {
                print("Error subscribing to player state:" + error.localizedDescription)
            }
        })
        fetchPlayerState()
    }
    
    func appRemote(_ appRemote: SPTAppRemote, didDisconnectWithError error: Error?) {
        lastPlayerState = nil
    }
    
    func appRemote(_ appRemote: SPTAppRemote, didFailConnectionAttemptWithError error: Error?) {
        lastPlayerState = nil
    }
    
    // MARK: - SPTAppRemotePlayerAPIDelegate

    func playerStateDidChange(_ playerState: SPTAppRemotePlayerState) {
        update(playerState: playerState)
    }
}
