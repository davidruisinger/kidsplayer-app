import { useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import { SpotifyApi, InMemoryCachingStrategy } from "@spotify/web-api-ts-sdk";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

const api = SpotifyApi.withClientCredentials(
  "c105950d5dcf4b3aba8e1238e1a3a908",
  "8396926f62554d46b497136eae0ac2a5",
  undefined,
  {
    cachingStrategy: new InMemoryCachingStrategy(),
  }
);

interface Item {
  label: string;
  uri: string;
  imageUrl: string;
  type: string;
  artist: string;
  popularity: number;
}

export default function SearchScreen() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Item[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const search = async () => {
    try {
      const items = await api.search(query, ["album", "track"]);
      const combinedResults = [
        ...items.albums.items.map((item) => ({
          label: item.name,
          uri: item.uri,
          imageUrl: item.images[0]?.url || "",
          type: "Album",
          artist: item.artists.map((artist) => artist.name).join(", "),
          popularity: item.popularity,
        })),
        ...items.tracks.items.map((item) => ({
          label: item.name,
          uri: item.uri,
          imageUrl: item.album.images[0]?.url || "",
          type: "Track",
          artist: item.artists.map((artist) => artist.name).join(", "),
          popularity: item.popularity,
        })),
      ];

      // Sort by popularity
      combinedResults.sort((a, b) => b.popularity - a.popularity);

      setResults(combinedResults);
    } catch (e) {
      console.error("Error fetching search results", e);
    }
  };

  const writeCard = async (value: string) => {
    let result = false;
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
    console.log(result);
    return result;
  };

  const handlePress = (item: Item) => {
    if (item.type === "Track" || item.type === "Album") {
      console.log("writing card", item.uri);
      writeCard(item.uri);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Input
        style={isFocused ? styles.inputFocused : styles.input}
        onChangeText={setQuery}
        onSubmitEditing={search}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        leftIcon={<Icon name="search" type="font-awesome" color="white" />}
        placeholder="Search for albums or tracks..."
        placeholderTextColor="gray"
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handlePress(item)}>
            <View style={styles.item}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.textContainer}>
                <ThemedText style={styles.label}>{item.label}</ThemedText>
                <ThemedText style={styles.subline}>
                  {item.type} • {item.artist}
                </ThemedText>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: {
    color: "white",
  },
  inputFocused: {
    color: "white",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  item: {
    flexDirection: "row",
    padding: 10,
    margin: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: "white",
  },
  subline: {
    fontSize: 12,
    color: "gray",
  },
});
