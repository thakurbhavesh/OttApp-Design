import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Share,
  StyleSheet,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const IMAGE_URL =
  "https://cdn.pixabay.com/photo/2025/03/13/10/50/fall-9467534_1280.jpg";

const sliderImages = [
  { id: "1", image: IMAGE_URL },
  { id: "2", image: "https://picsum.photos/800/400?1" },
  { id: "3", image: "https://picsum.photos/800/400?2" },
];

const languages = [
  { id: "1", name: "Hindi", color: "#f28b25" },
  { id: "2", name: "Tamil", color: "#d89c28" },
  { id: "3", name: "Bhojpuri", color: "#f28b25" },
  { id: "4", name: "English", color: "#4a73c9" },
  { id: "5", name: "Telugu", color: "#41c9c5" },
  { id: "6", name: "Malayalam", color: "#7ec75f" },
  { id: "7", name: "Punjabi", color: "#e46d6d" },
  { id: "8", name: "Kannada", color: "#5fc780" },
  { id: "9", name: "Marathi", color: "#9b5fc7" },
  { id: "10", name: "Bengali", color: "#f28b25" },
  { id: "11", name: "Odia", color: "#e1a467" },
];

const games = [
  { id: "1", name: "Kitchen Sorting", image: IMAGE_URL },
  { id: "2", name: "Watermelon Fusion", image: IMAGE_URL },
];

const chunkArray = (arr, size) =>
  arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);

const sections = [
  { id: "slider", type: "slider" },
  { id: "languages", type: "languages", title: "Browse by Language" },
  { id: "top", type: "movies", title: "Audio Originals" },
  { id: "next", type: "movies", title: "Audio Dramas" },
  { id: "binge", type: "movies", title: "Talking Divas" },
  { id: "games", type: "games", title: "Games" },
];

export default function Audiot() {
  const renderSection = ({ item }) => {
    if (item.type === "slider") {
      return (
        <View style={styles.sliderContainer}>
          <FlatList
            data={sliderImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image }}
                style={styles.sliderImage}
              />
            )}
          />
          <View style={styles.sliderOverlay}>
            <View style={styles.sliderButtonContainer}>
              <TouchableOpacity style={styles.subscribeButton}>
                <FontAwesome name="crown" size={18} color="#000" />
                <Text style={styles.subscribeText}>Subscribe Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => Share.share({ message: "Check out Hungama OTT!" })}
              >
                <Ionicons name="share-social" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === "languages") {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={chunkArray(languages, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `lang-${i}`}
            renderItem={({ item: langChunk }) => (
              <View style={styles.languageRow}>
                {langChunk.map((lang) => (
                  <View
                    key={lang.id}
                    style={[styles.languageCard, { backgroundColor: lang.color }]}
                  >
                    <Text style={styles.languageText}>{lang.name}</Text>
                  </View>
                ))}
              </View>
            )}
          />
        </View>
      );
    }

    if (item.type === "movies" || item.type === "games") {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={games}
            horizontal
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.gameCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.gameImage}
                />
                <Text style={styles.gameText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.id}
      renderItem={renderSection}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 12,
  },
  sliderContainer: {
    marginBottom: 24,
    position: "relative",
  },
  sliderImage: {
    width: width - 20,
    height: 200,
    borderRadius: 12,
    marginRight: 8,
  },
  sliderOverlay: {
    position: "absolute",
    top: "40%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  sliderButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  subscribeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  subscribeText: {
    color: "#000",
    fontWeight: "600",
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: "#e50914",
    borderRadius: 9999,
    padding: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  languageRow: {
    width: width - 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  languageCard: {
    width: 100,
    height: 70,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  languageText: {
    color: "#fff",
    fontWeight: "700",
  },
  gameCard: {
    marginRight: 16,
    width: 180,
  },
  gameImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  gameText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
  },
});