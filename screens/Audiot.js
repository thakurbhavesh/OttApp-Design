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
  "https://images.pexels.com/photos/1648531/pexels-photo-1648531.jpeg";

export default function AudioScreen() {
  const navigation = useNavigation();
  const [allAudios, setAllAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const BASE_API_URL =
    "http://10.205.61.40/ott_app/AppApi/all_content.php?status=active&main_category_id=4&api_key=" +
    API_KEY;

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_API_URL, { headers: { "X-API-KEY": API_KEY } });
      const json = await res.json();
      if (json.status === "success" && json.data) setAllAudios(json.data);
      else setError(json.message || "Failed to load audios");
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

  const filteredAudios =
    searchText.trim() === ""
      ? allAudios
      : allAudios.filter((m) =>
          [
            m.title,
            m.language_name,
            m.plan_type,
            m.category_name,
            m.industry,
            m.preference_name,
            m.main_category_name,
          ]
            .filter(Boolean)
            .some((field) =>
              field.toLowerCase().includes(searchText.toLowerCase())
            )
        );

  const renderAudio = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
     onPress={() => {
      // Log the item data
      console.log("Movies item pressed:", item);

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
        style={styles.cardImage}
      />

      {/* Top badges */}
      <View style={styles.topBadgesRow}>
        {item.plan_type && (
          <Text style={[styles.topBadge, { backgroundColor: getPlanColor(item.plan_type) }]}>
            {item.plan_type.toUpperCase()}
          </Text>
        )}
        {item.preference_name && (
          <Text
            style={[styles.topBadge, { backgroundColor: getPreferenceColor(item.preference_name) }]}
          >
            {item.preference_name}
          </Text>
        )}
      </View>

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={styles.overlay}
      />

      <View style={styles.playButton}>
        <Ionicons name="musical-notes" size={20} color="#fff" />
      </View>

      {/* Bottom info */}
      <View style={styles.infoContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.badgesRow}>
          {item.category_name && (
            <Text style={[styles.badge, { backgroundColor: "#6a1b9a" }]}>
              {item.category_name}
            </Text>
          )}
          {item.language_name && (
            <Text style={[styles.badge, { backgroundColor: "#00897b" }]}>
              {item.language_name}
            </Text>
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
          placeholder="Search audios..."
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
        data={filteredAudios}
        keyExtractor={(item, idx) => item.id || idx.toString()}
        renderItem={renderAudio}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  cardImage: { width: "100%", height: CARD_WIDTH * 1.2, borderRadius: 14 },
  overlay: { ...StyleSheet.absoluteFillObject, borderRadius: 14 },
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
  infoContainer: { position: "absolute", bottom: 10, left: 8, right: 8 },
  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 4 },
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
