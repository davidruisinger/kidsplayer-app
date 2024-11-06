import { useState } from "react";
import { Button, StyleSheet, TouchableHighlight } from "react-native";
import { InMemoryCachingStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@rneui/themed";
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import NfcProxy from "@/services/NfcProxy";

const api = SpotifyApi.withClientCredentials(
  "c105950d5dcf4b3aba8e1238e1a3a908",
  "8396926f62554d46b497136eae0ac2a5", undefined, {
    cachingStrategy: new InMemoryCachingStrategy()
  }
);

interface Item { label: string; uri: string }

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
    }
    catch(e) {
      console.error("Error fetching search results", e);
    }
  };

  const storeToCard = async (item: Item) => {
    console.log("Store to card");


  };

  const readCard = async () => {
    try {
      const enabled = await NfcProxy.isEnabled();
      console.log('NFC enabled', enabled);
      
      const tag = await NfcProxy.readTag()
      console.log('Tag found', tag);
      
      // // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // // the resolved tag object will contain `ndefMessage` property
      // const tag = await NfcManager.getTag();
      // console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Input style={styles.input} onChangeText={setQuery} onSubmitEditing={search} />

      <Button title="read card" onPress={readCard} />


      {results?.map((result) => (
        <TouchableHighlight onPress={() => storeToCard(result)} key={result.uri}>
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
