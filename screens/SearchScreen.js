// screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For play button icon

const LOCAL_API_URL = 'http://10.205.61.40/ott_app/AppApi/all_content.php?api_key=your_secure_api_key&status=active';
const SEARCH_API_URL = 'http://10.205.61.40/ott_app/AppApi/search_content.php?api_key=your_secure_api_key&status=active';
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpg';
const CARD_WIDTH = 160; // Define card width
const CARD_MARGIN = 8;  // Define card margin

export default function SearchScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]); // One item per main_category_name
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialCategories();
  }, []);

  const fetchInitialCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(LOCAL_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      if (json.status === 'success') {
        const processedData = json.data.map(item => ({
          ...item,
          thumbnail_url: item.thumbnail_url || DEFAULT_IMAGE,
        }));

        // Group by main_category_name and pick one item per category
        const grouped = processedData.reduce((acc, item) => {
          const category = item.main_category_name || 'Other';
          if (!acc[category]) {
            acc[category] = item; // Pick first item per category
          }
          return acc;
        }, {});

        const categoryList = Object.values(grouped);
        setCategories(categoryList);
      } else {
        throw new Error(json.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.trim().length < 2) { // Minimum 2 characters for search
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const searchUrl = `${SEARCH_API_URL}&q=${encodeURIComponent(text)}`;
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Search HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      if (json.status === 'success') {
        const processedResults = json.data.map(item => ({
          ...item,
          thumbnail_url: item.thumbnail_url || DEFAULT_IMAGE,
        }));
        setSearchResults(processedResults);
      } else {
        throw new Error(json.error || 'Search failed');
      }
    } catch (err) {
      Alert.alert('Search Error', err.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ViewDetails', {
          item: {
            id: item.content_id,
            title: item.title,
            thumbnail_url: item.thumbnail_url,
            trailer_url: item.trailer_url || '',
            plan: item.plan_type || 'free',
            industry: item.industry || '',
            language_name: item.language_name || '',
            preference_name: item.preference_name || '',
            category_name: item.category_name || '',
            main_category_name: item.main_category_name || 'Other',
            manage_selected: item.episodes || [],
          },
        })
      }
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail_url }} style={styles.movieImage} resizeMode="cover" />
      <View style={styles.movieOverlay}>
        <View style={styles.topBadgesRow}>
          <Text style={[styles.topBadge, { backgroundColor: '#f57c00' }]}>
            {item.plan_type || 'Free'}
          </Text>
        </View>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.badgesRow}>
            <Text style={[styles.badge, { backgroundColor: '#333' }]}>
              {item.main_category_name || 'Other'}
            </Text>
            <Text style={[styles.badge, { backgroundColor: '#444' }]}>
              {item.language_name || 'N/A'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.playButton}>
          <Icon name="play" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.playButton} onPress={fetchInitialCategories}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search content (min 2 chars)..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>
      {searchText.trim().length < 2 ? (
        // Initial view: One item per category (vertical single-column)
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => `category-${item.content_id}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : searchLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#f57c00" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        // Search results view (vertical single-column)
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={item => `search-${item.content_id}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    width: 2200 / 7, // Adjust card width for better fit
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
  movieTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 4, autoCapitalize:"words" },
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
  loadingText: { color: "#fff", marginTop: 10, fontSize: 16 },
  errorText: { color: "#f57c00", fontSize: 18, textAlign: "center", marginBottom: 20 },
  retryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});