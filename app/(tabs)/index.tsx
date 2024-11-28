import { Image, StyleSheet, Button } from "react-native";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

import {
  isAvailable,
  authenticateAsync,
  togglePlay,
} from "@/modules/little-spotify";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useRef } from "react";

export default function HomeScreen() {
  const spotifySdk = useRef<SpotifyApi>();

  useEffect(() => {
    if (!isAvailable()) {
      console.error("not available");
    }
  });

  const authenticate = async () => {
    try {
      const auth = await authenticateAsync({
        scopes: [
          // https://developer.spotify.com/documentation/web-api/concepts/scopes
          "user-read-playback-state",
          "user-modify-playback-state",
          "user-read-currently-playing",
        ],
      });

      console.log(auth);

      spotifySdk.current = SpotifyApi.withAccessToken(
        "c105950d5dcf4b3aba8e1238e1a3a908",
        {
          access_token: auth.accessToken,
          expires_in: auth.expirationDate,
          refresh_token: auth.refreshToken,
          token_type: "Bearer",
          expires: auth.expirationDate,
        }
      );
      console.log({
        auth,
      });
    } catch (e) {
      console.log({
        e,
      });
    }
  };

  const playTrack = async () => {
    spotifySdk.current?.player.startResumePlayback(
      "",
      "spotify:album:1Je1IMUlBXcx1Fz0WE7oPT"
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Button title="authenticate" onPress={authenticate} />
        <Button title="toggle play" onPress={togglePlay} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
