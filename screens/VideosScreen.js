import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../navigation/Header";
import TopTabs from "../navigation/TopTabs";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 180; // image height only

const API_URL =
  "http://10.205.61.40/ott_app/AppApi/all_content.php?status=active&api_key=your_secure_api_key";

export default function Videos() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.status === "success" && json.data) {
        const filtered = json.data.filter(
          (item) => item.main_category_name.toLowerCase() !== "audio"
        );
        setData(filtered);
      } else setError(json.message || "Failed to load videos");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filtered = data;

    if (filterCategory) {
      filtered = filtered.filter(
        (item) =>
          item.main_category_name.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (searchText.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const renderCard = ({ item }) => {
    const filteredData = getFilteredData();
    let dynamicWidth = width / 2 - 15;

    if (filteredData.length === 1) dynamicWidth = width - 20;
    else if (filteredData.length === 2) dynamicWidth = (width - 30) / 2;

    return (
      <TouchableOpacity
        style={[styles.card, { width: dynamicWidth }]}
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
        {/* Image */}
        <View
          style={{ height: CARD_HEIGHT, borderRadius: 10, overflow: "hidden" }}
        >
          <Image
            source={{ uri: item.thumbnail_url }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Top Badges */}
          <View style={styles.topBadgesRow}>
            {item.language_name && (
              <Text style={[styles.topBadge, { backgroundColor: "#6a1b9a" }]}>
                {item.language_name}
              </Text>
            )}
            {item.preference_name && (
              <Text style={[styles.topBadge, { backgroundColor: "#0277bd" }]}>
                {item.preference_name}
              </Text>
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Category */}
        <Text style={styles.category}>{item.category_name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#F97316"
        style={{ marginTop: 50 }}
      />
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <TopTabs initialRouteName="Videos" />

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search videos..."
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

      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={filterCategory}
          onValueChange={(itemValue) => setFilterCategory(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Movies" value="Movies" />
          <Picker.Item label="Webseries" value="Webseries" />
          <Picker.Item label="TV Shows" value="TV Shows" />
        </Picker>
      </View>

      {/* Video List */}
      <FlatList
        data={getFilteredData()}
        keyExtractor={(item) => item.id || item.title}
        renderItem={renderCard}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    margin: 1,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
  dropdownContainer: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  picker: { color: "#fff" },
  card: {
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 5,
    paddingHorizontal: 5,
  },
  category: {
    color: "#9CA3AF",
    fontSize: 12,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  topBadgesRow: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    zIndex: 2,
  },
  topBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
