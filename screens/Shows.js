import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const IMAGE_URL =
  "https://cdn.pixabay.com/photo/2025/03/13/10/50/fall-9467534_1280.jpg";

const languages = [
  { id: "1", name: "Hindi", color: "#f28b25" },
  { id: "2", name: "Tamil", color: "#d89c28" },
  { id: "3", name: "English", color: "#4a73c9" },
  { id: "4", name: "Hindi", color: "#f28b25" },
  { id: "5", name: "Tamil", color: "#d89c28" },
  { id: "6", name: "English", color: "#4a73c9" },
  { id: "7", name: "Hindi", color: "#f28b25" },
  { id: "8", name: "Tamil", color: "#d89c28" },
  { id: "9", name: "English", color: "#4a73c9" },
  { id: "10", name: "Hindi", color: "#f28b25" },
  { id: "11", name: "Tamil", color: "#d89c28" },
  { id: "12", name: "English", color: "#4a73c9" },
  { id: "13", name: "Hindi", color: "#f28b25" },
  { id: "14", name: "Tamil", color: "#d89c28" },
  { id: "15", name: "English", color: "#4a73c9" },
];

const games = [
  {
    id: "1",
    name: "Kitchen Sorting",
    image: IMAGE_URL,
    title: "Kitchen Sorting",
    author: "Game Studio",
    description: "Sort ingredients in a fast-paced kitchen challenge.",
  },
  {
    id: "2",
    name: "Watermelon Fusion",
    image: IMAGE_URL,
    title: "Watermelon Fusion",
    author: "Fruit Lab",
    description: "Merge fruits and unlock juicy combos.",
  },
  {
    id: "3",
    name: "Watermelon Fusion",
    image: IMAGE_URL,
    title: "Watermelon Fusion",
    author: "Fruit Lab",
    description: "Merge fruits and unlock juicy combos.",
  },
  {
    id: "4",
    name: "Watermelon Fusion",
    image: IMAGE_URL,
    title: "Watermelon Fusion",
    author: "Fruit Lab",
    description: "Merge fruits and unlock juicy combos.",
  },
];

const movies = Array(6)
  .fill(0)
  .map((_, i) => ({
    id: `m${i}`,
    title: `Movie ${i + 1}`,
    author: "Director Name",
    image: IMAGE_URL,
    description: "A thrilling cinematic experience.",
  }));

const chunkArray = (arr, size) =>
  arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);

const sections = [
  { id: "top", type: "movies", title: "Top 20 Movies" },
  { id: "next", type: "movies", title: "Premium Rentals" },
  { id: "languages", type: "languages", title: "Languages" },
  { id: "games", type: "games", title: "Classics" },
];

export default function MoviesScreen() {
  const navigation = useNavigation();

  const renderSection = ({ item }) => {
    if (item.type === "movies") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={movies}
            horizontal
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ViewDetails", { item })}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
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
                    onPress={() =>
                      navigation.navigate("ViewDetails", {
                        item: {
                          title: lang.name,
                          author: "Language Pack",
                          description: `Explore content in ${lang.name}`,
                        },
                      })
                    }
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
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ViewDetails", { item })}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
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
  section: { marginBottom: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: 120,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#222",
    padding: 6,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  author: {
    color: "#aaa",
    fontSize: 12,
  },
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
  },
  langText: { color: "#fff", fontWeight: "bold" },
});