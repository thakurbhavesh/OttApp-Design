import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "your_secure_api_key"; // replace
const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg";

export default function Shows() {
  const navigation = useNavigation();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const BASE_API_URL =
    "http://10.205.61.40/ott_app/AppApi/all_content.php?status=active&main_category_id=2&api_key=" +
    API_KEY;

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_API_URL, { headers: { "X-API-KEY": API_KEY } });
      const json = await res.json();
      if (json.status === "success" && json.data) setSeries(json.data);
      else setError(json.message || "Failed to load Shows");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan) =>
    plan === "free" ? "#34c759" : plan === "paid" ? "#ff3b30" : "#666";
  const getPreferenceColor = (pref) =>
    pref === "Adult"
      ? "#d32f2f"
      : pref === "Kids"
      ? "#1e88e5"
      : pref === "General"
      ? "#fbc02d"
      : "#666";

  const filteredSeries =
    searchText.trim() === ""
      ? series
      : series.filter((s) =>
          [
            s.title,
            s.language_name,
            s.plan_type,
            s.category_name,
            s.industry,
            s.preference_name,
            s.main_category_name,
          ]
            .filter(Boolean)
            .some((field) =>
              field.toLowerCase().includes(searchText.toLowerCase())
            )
        );

  const renderSeries = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.9}
    onPress={() => {
      // Log the item data
      console.log("Shows item pressed:", item);

      // Navigate to ViewDetails
      navigation.navigate("ViewDetails", {
        item: {
          id: item.id?.toString() || item.content_id?.toString() || "0",
          title: item.title || "Unknown Title",
          author: item.industry || "Unknown",
          image: item.thumbnail_url || DEFAULT_IMAGE,
          description: item.description || "",
          main_category: item.main_category_name || "Unknown",
          category: item.category_name || "Unknown",
          language: item.language_name || "Unknown",
          preference: item.preference_name || "Unknown",
          plan_type: item.plan_type || "Unknown",
        },
      });
    }}
  >
    <Image
      source={{ uri: item.thumbnail_url || DEFAULT_IMAGE }}
      style={styles.movieImage}
    />

    {/* Top badges */}
    <View style={styles.topBadgesRow}>
      {item.plan_type && (
        <Text style={[styles.topBadge, { backgroundColor: getPlanColor(item.plan_type) }]}>
          {item.plan_type.toUpperCase()}
        </Text>
      )}
      {item.preference_name && (
        <Text style={[styles.topBadge, { backgroundColor: getPreferenceColor(item.preference_name) }]}>
          {item.preference_name}
        </Text>
      )}
    </View>

    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.85)"]}
      style={styles.movieOverlay}
    />

    <View style={styles.playButton}>
      <Ionicons name="play" size={20} color="#fff" />
    </View>

    {/* Bottom Info */}
    <View style={styles.movieInfo}>
      <Text style={styles.movieTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.badgesRow}>
        {item.category_name && (
          <Text style={[styles.badge, { backgroundColor: "#6a1b9a" }]}>
            {item.category_name}
          </Text>
        )}
        {item.industry && (
          <Text style={[styles.badge, { backgroundColor: "#8e24aa" }]}>{item.industry}</Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);



  if (loading)
    return <ActivityIndicator size="large" color="#e50914" style={{ marginTop: 40 }} />;
  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search Shows..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={22} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredSeries}
        keyExtractor={(item, idx) => item.id || idx.toString()}
        renderItem={renderSeries}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    margin: 12,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
  listContainer: { paddingHorizontal: CARD_MARGIN, paddingBottom: 20 },
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN / 2,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#111",
    elevation: 4,
  },
  movieImage: { width: "100%", height: CARD_WIDTH * 1.2, borderRadius: 14 },
  movieOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 14 },
  playButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 20,
    padding: 6,
  },
  topBadgesRow: { position: "absolute", top: 8, left: 8, flexDirection: "row", zIndex: 2 },
  topBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  movieInfo: { position: "absolute", bottom: 10, left: 8, right: 8 },
  movieTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  badgesRow: { flexDirection: "row", flexWrap: "wrap" },
  badge: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
