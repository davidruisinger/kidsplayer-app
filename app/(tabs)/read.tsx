import React, { useState, useEffect } from "react";
import { View, Button, Text, Image, StyleSheet } from "react-native";
import { InMemoryCachingStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

// Initialize Spotify API
const api = SpotifyApi.withClientCredentials(
  "c105950d5dcf4b3aba8e1238e1a3a908",
  "8396926f62554d46b497136eae0ac2a5",
  undefined,
  {
    cachingStrategy: new InMemoryCachingStrategy(),
  }
);

export default function ReadScreen() {
  const [spotifyUri, setSpotifyUri] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize NFC Manager
    NfcManager.start();
    // return () => {
    //   NfcManager.close();
    // };
  }, []);

  const isValidSpotifyUri = (uri: string) => {
    // Validation for Spotify URI to support both tracks and albums
    return uri.startsWith("spotify:track:") || uri.startsWith("spotify:album:");
  };

  const handleRFIDRead = async () => {
    let uri: string | null = null;

    try {
      await NfcManager.requestTechnology([NfcTech.Ndef]);

      const tag = await NfcManager.getTag();
      if (!tag || !tag.ndefMessage || tag.ndefMessage.length === 0) {
        setError("No valid NDEF message found.");
        return;
      }

      const ndef = tag.ndefMessage[0];

      if (ndef.tnf !== Ndef.TNF_WELL_KNOWN) {
        setError("Tag is not a well known NDEF message.");
        return;
      }

      uri = Ndef.text.decodePayload(new Uint8Array(ndef.payload));
      await NfcManager.setAlertMessageIOS("Success");
    } catch (err) {
      setError("Error reading RFID data.");
      console.error("RFID Read Error:", err);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    if (uri) {
      try {
        setSpotifyUri(uri);
        console.log("Spotify URI:", uri);

        if (isValidSpotifyUri(uri)) {
          const id = uri.split(":")[2]; // Extract the ID from the URI
          console.log("Spotify ID:", id);

          let response;
          if (uri.startsWith("spotify:track:")) {
            response = await api.tracks.get(id);
          } else if (uri.startsWith("spotify:album:")) {
            response = await api.albums.get(id);
          }

          console.log("Spotify API Response:", response);

          if (response) {
            setItem(response);
            setError(null);
          } else {
            setError("Invalid Spotify item.");
          }
        } else {
          setError("Invalid Spotify URI.");
        }
      } catch (err) {
        setError("Error fetching data.");
        console.error("Spotify API Error:", err);
      }
    }
  };

  useEffect(() => {
    if (item) {
      console.log("Item object:", item);
    }
  }, [item]);

  return (
    <View style={styles.container}>
      <Button title="Read RFID" onPress={handleRFIDRead} />
      {error && <Text style={styles.error}>{error}</Text>}
      {item && (
        <View style={styles.itemContainer}>
          <Image
            source={{
              uri: item.images ? item.images[0].url : item.album.images[0].url,
            }}
            style={styles.largeImage}
          />
          <Text style={styles.headline}>
            {item.name || "No Title Available"}
          </Text>
          <Text style={styles.subtext}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} -{" "}
            {item.artists ? item.artists[0].name : item.album.artists[0].name}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  itemContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  largeImage: {
    width: 200,
    height: 200,
  },
  headline: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtext: {
    marginTop: 5,
    fontSize: 16,
    color: "gray",
  },
});
