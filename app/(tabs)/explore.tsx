import { useState } from "react";
import { Button, StyleSheet, TouchableHighlight } from "react-native";
import { InMemoryCachingStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@rneui/themed";
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
}

export default function TabTwoScreen() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Item[]>();

  const search = async () => {
    try {
      const items = await api.search(query, ["album"]);

      setResults(
        items.albums.items.map((item) => ({
          label: item.name,
          uri: item.uri,
        }))
      );
    } catch (e) {
      console.error("Error fetching search results", e);
    }
  };

  const writeCard = async (value: string) => {
    let result = false;

    try {
      // STEP 1
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);

      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }

    console.log(result);
    return result;
  };

  return (
    <ThemedView style={styles.container}>
      <Input
        style={styles.input}
        onChangeText={setQuery}
        onSubmitEditing={search}
      />

      {results?.map((result) => (
        <TouchableHighlight
          onPress={() => writeCard(result.uri)}
          key={result.uri}
        >
          <ThemedView style={styles.item} key={result.uri}>
            <ThemedText>{result.label}</ThemedText>
          </ThemedView>
        </TouchableHighlight>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: {
    color: "white",
  },
  item: {
    padding: 10,
    margin: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
});
