import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
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
];

const games = [
  {
    id: "1",
    title: "Kitchen Sorting",
    author: "Game Studio",
    image: IMAGE_URL,
  },
  {
    id: "2",
    title: "Watermelon Fusion",
    author: "Fruit Lab",
    image: IMAGE_URL,
  },
  {
    id: "3",
    title: "Fruit Ninja Clone",
    author: "Fruit Lab",
    image: IMAGE_URL,
  },
];

const sections = [
  { id: "languages", type: "languages", title: "Browse by Language" },
  { id: "top", type: "movies", title: "Top Movies" },
  { id: "next", type: "movies", title: "Recommended" },
];

export default function Movies() {
  const navigation = useNavigation();

  const renderSection = ({ item }) => {
    if (item.type === "languages") {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={languages}
            horizontal
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[styles.languageCard, { backgroundColor: item.color }]}
              >
                <Text style={styles.languageText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      );
    }

    if (item.type === "movies") {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <FlatList
            data={games}
            horizontal
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.movieCard}
                onPress={() => navigation.navigate("ViewDetails", { item })}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.movieImage}
                />
                <Text
                  style={styles.movieTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={styles.movieAuthor}>{item.author}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
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
  languageCard: {
    width: 112,
    height: 64,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  languageText: {
    color: "#fff",
    fontWeight: "700",
  },
  movieCard: {
    width: 128,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#171717",
    padding: 8,
  },
  movieImage: {
    width: "100%",
    height: 144,
    borderRadius: 6,
  },
  movieTitle: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
  },
  movieAuthor: {
    color: "#aaa",
    fontSize: 12,
  },
});