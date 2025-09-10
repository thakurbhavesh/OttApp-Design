import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Share,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../navigation/Header";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 140;

const SubscribeShareButtons = ({ onShare }) => (
  <View style={styles.row}>
    <TouchableOpacity style={styles.subscribeBtn}>
      <Text style={styles.subscribeText}>Subscribe</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
      <Ionicons name="share-outline" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Audio() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("All Audio");
  const [searchText, setSearchText] = useState("");

  const API_URL =
    "http://10.159.104.40/ott_app/AppApi/all_content.php?api_key=your_secure_api_key&status=active&main_category_id=4";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.status === "success") {
        setData(json.data);
      }
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: "Check out this amazing audio!" });
    } catch (err) {
      console.log(err);
    }
  };

  // Filter by tab
  const filterByTab = (tab) => {
    let filtered = data;
    if (tab === "Music") filtered = data.filter((i) => i.category_name.toLowerCase() === "music");
    if (tab === "Podcasts") filtered = data.filter((i) => i.category_name.toLowerCase() === "podcast");
    return filtered;
  };

  // Filter by search
  const filterBySearch = (list) => {
    if (!searchText) return list;
    return list.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const renderCard = (item) => (
    <TouchableOpacity
      style={styles.card}
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
      <Image source={{ uri: item.thumbnail_url }} style={styles.image} />

      {/* Top badges */}
      <View style={styles.topBadgesRow}>
        {item.plan_type && (
          <Text
            style={[
              styles.topBadge,
              { backgroundColor: item.plan_type === "free" ? "#34c759" : "#ff3b30" },
            ]}
          >
            {item.plan_type.toUpperCase()}
          </Text>
        )}
        {item.preference_name && (
          <Text
            style={[
              styles.topBadge,
              { backgroundColor: item.preference_name === "Adult" ? "#d32f2f" : "#1e88e5" },
            ]}
          >
            {item.preference_name}
          </Text>
        )}
      </View>

      {/* Bottom info */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.language_name}</Text>
    </TouchableOpacity>
  );

  if (loading)
    return <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 50 }} />;

  const filteredTabData = filterByTab(selectedTab);
  const finalData = filterBySearch(filteredTabData);

  return (
    <View style={styles.container}>
      <Header />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["All Audio", "Music", "Podcasts"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search audio..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Audio List */}
      <FlatList
        data={finalData}
        keyExtractor={(item, index) => item.title + index}
        horizontal={false}
        numColumns={2}
        renderItem={({ item }) => renderCard(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    paddingVertical: 10,
  },
  tabText: { color: "gray", fontSize: 16, fontWeight: "600" },
  activeTab: { color: "#F97316", borderBottomWidth: 2, borderBottomColor: "#F97316" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, height: 40, color: "#fff" },
  card: { flex: 1, margin: 5, height: CARD_WIDTH + 50 },
  image: { width: "100%", height: CARD_WIDTH, borderRadius: 10 },
  title: { color: "#fff", fontWeight: "600", marginTop: 5 },
  author: { color: "#9CA3AF", fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", padding: 8, borderRadius: 30 },
  subscribeBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#F97316", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginRight: 10 },
  subscribeText: { color: "#fff", marginLeft: 7, fontWeight: "600", fontSize: 15 },
  shareBtn: { backgroundColor: "#F97316", borderRadius: 20, padding: 9, alignItems: "center", justifyContent: "center" },
  topBadgesRow: { position: "absolute", top: 8, left: 8, flexDirection: "row", zIndex: 2 },
  topBadge: { fontSize: 10, fontWeight: "700", color: "#fff", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginRight: 6 },
});
