import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, Image, StyleSheet,
  TouchableOpacity, TextInput, ActivityIndicator, Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Library() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");
        console.log(user_id) 
        if (!user_id) {
          setLoading(false);
          return;
        }

        const url = `http://10.205.61.40/ott_app/AppApi/library_data.php?user_id=${user_id}&status=active&type=all&api_key=your_secure_api_key`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.status === "success") {
          // remove duplicates by content_id + preference_type
          const ids = new Set();
          const unique = [];
          json.data.forEach(row => {
            const key = `${row.content_id}-${row.preference_type}`;
            if (!ids.has(key)) {
              ids.add(key);
              unique.push(row);
            }
          });
          setAllData(unique);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = allData.filter(item => {
    const matchTab =
      tab === "All" ||
      item.preference_type?.toLowerCase() === tab.toLowerCase();
    const matchSearch = item.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchTab && matchSearch;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ViewDetails", {
          content_id: String(item.content_id),   // ✅ pass correct id
          title: item.title,
          image: item.thumbnail_url,
          videoUrl: item.video_url,
          duration: item.duration,
          description: item.description,
        })
      }
    >
      <Image source={{ uri: item.thumbnail_url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.duration || "—"} • {item.release_date || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.tabs}>
        {["All", "Watchlist", "Like"].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[styles.tab, tab === t && styles.tabActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="videocam-off" size={40} color="#888" />
          <Text style={styles.emptyText}>No content found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) =>
            `${item.content_id}-${item.preference_type || idx}`
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282c34", padding: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  search: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  tab: { color: "#aaa", fontSize: 16, paddingVertical: 6 },
  tabActive: {
    color: "#fff",
    fontWeight: "bold",
    borderBottomWidth: 3,
    borderBottomColor: "#00e0ff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: width * 0.32, height: width * 0.2 },
  info: { flex: 1, padding: 12, justifyContent: "center" },
  title: { color: "#fff", fontSize: 16, fontWeight: "600" },
  meta: { color: "#aaa", fontSize: 12, marginTop: 4 },
  emptyBox: { flex: 1, alignItems: "center", marginTop: 40 },
  emptyText: { color: "#888", fontSize: 16, marginTop: 10 },
});
