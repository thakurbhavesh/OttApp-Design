import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Share,
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
  { id: "top", type: "movies", title: "Audio Originals" },
  { id: "next", type: "movies", title: "Audio Dramas" },
  { id: "binge", type: "movies", title: "Talking Divas" },
  { id: "bollywood", type: "movies", title: "Self Care 101" },
  { id: "dubbed", type: "movies", title: "Better Health 2025" },
  { id: "new", type: "movies", title: "Better Health 2025" },
  { id: "independent", type: "movies", title: "Hidden Gems" },
  { id: "miss", type: "movies", title: "In The Mood For" },
  { id: "recommended", type: "movies", title: "Top in Hindi" },
  { id: "languages", type: "languages", title: "Top in English" },
  { id: "games", type: "games", title: "Culture Talks" },
  { id: "Business", type: "Business", title: "Business Talks" },
  { id: "Humour", type: "Humour", title: "Top in Humour" },
];

export default function GamesScreen() {
  const handleShare = async () => {
    try {
      await Share.share({ message: "Check out this amazing app!" });
    } catch (error) {
      console.log(error);
    }
  };

  const renderSection = ({ item }) => {
    if (item.type === "slider") {
      return (
        <View style={styles.sliderWrapper}>
          <FlatList
            data={sliderImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.sliderImage} />
            )}
          />
          <View style={styles.sliderOverlay}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.subscribeBtn}>
                <FontAwesome name="crown" size={18} color="#222" />
                <Text style={styles.subscribeText}>Subscribe Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Ionicons name="share-social" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === "movies") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={Array(6).fill(0)}
            horizontal
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ index }) => (
              <TouchableOpacity>
                <Image source={{ uri: IMAGE_URL }} style={styles.movieCard} />
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }

    if (item.type === "languages") {
      const slides = chunkArray(languages, 3);
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={slides}
            horizontal
            pagingEnabled
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.langSlide}>
                {item.map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    style={[styles.langCard, { backgroundColor: lang.color }]}
                  >
                    <Text style={styles.langText}>{lang.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
      );
    }

    if (item.type === "games") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={games}
            horizontal
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.gameCard}>
                <Image source={{ uri: item.image }} style={styles.gameImage} />
                <Text style={styles.gameText}>{item.name}</Text>
              </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#000", padding: 10 },
  sliderWrapper: { position: "relative", marginBottom: 20 },
  sliderImage: {
    width: width - 20,
    height: 200,
    borderRadius: 12,
    marginRight: 10,
  },
  sliderOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 30,
  },
  subscribeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  subscribeText: {
    color: "#222",
    marginLeft: 7,
    fontWeight: "600",
    fontSize: 15,
  },
  shareBtn: {
    backgroundColor: "#e50914",
    borderRadius: 20,
    padding: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  movieCard: { width: 120, height: 160, borderRadius: 8, marginRight: 10 },
  langSlide: {
    width: width - 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  langCard: {
    width: width / 3.5,
    height: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  langText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  gameCard: { marginRight: 15, width: 180 },
  gameImage: { width: "100%", height: 120, borderRadius: 10 },
  gameText: { color: "#fff", marginTop: 6, fontSize: 14 },
});