// screens/MainHome.js
import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const API_KEY = "your_secure_api_key"; // Replace with your actual API key
const BASE_URL = "http://10.205.61.40/ott_app/AppApi/show_content.php";
const NEW_RELEASE_URL = "http://10.205.61.40/ott_app/AppApi/new_releases.php";
const USER_API = "http://10.205.61.40/ott_app/AppApi/insert_user.php";
const DEFAULT_IMAGE = "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg";

function SubscribeShareButtons() {
  const navigation = useNavigation();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={() => navigation.navigate("MainTabs", { screen: "Home", params: { screen: "Profile" } })}
      >
        <LinearGradient
          colors={["#FF6B35", "#F7931E"]}
          style={styles.subscribeGradient}
        >
          <FontAwesome5 name="crown" size={16} color="#fff" />
          <Text style={styles.subscribeText}>Subscribe Premium</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton}>
        <View style={styles.shareButtonInner}>
          <Ionicons name="share-social" size={18} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function MainHome() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [bannerData, setBannerData] = useState([]);
  const [topShowsData, setTopShowsData] = useState([]);
  const [bingeWorthyData, setBingeWorthyData] = useState([]);
  const [bollywoodBingeData, setBollywoodBingeData] = useState([]);
  const [dubbedInHindiData, setDubbedInHindiData] = useState([]);
  const [newReleaseData, setNewReleaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Fix thumbnail URLs
  const fixThumbnailUrl = (url) => {
    if (!url || url === "null" || url === null) return DEFAULT_IMAGE;
    return url.replace("http://localhost/ott_app", "http://10.205.61.40/ott_app");
  };

  // Generate unique ID for items without content_id
  const generateUniqueId = (item, index) => {
    return item.content_id ? item.content_id.toString() : `generated-${index}-${item.title}`;
  };

  // Auto scroll banner
  useEffect(() => {
    if (bannerData.length > 1) {
      autoScrollRef.current = setInterval(() => {
        const nextIndex = (currentBannerIndex + 1) % bannerData.length;
        setCurrentBannerIndex(nextIndex);
        bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 6000); // Increased interval to 6s for smoother transitions
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [currentBannerIndex, bannerData.length]);

  // Fetch data for a specific filter
  const fetchFilteredData = async (filter) => {
    try {
      const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&status=active&${filter}=1`);
      if (!response.ok) {
        throw new Error(`${filter} API error: ${response.status}`);
      }
      const json = await response.json();
      if (json.status === "success") {
        return json.data.map((item, index) => ({
          ...item,
          content_id: item.content_id || generateUniqueId(item, index),
          thumbnail_url: fixThumbnailUrl(item.thumbnail_url || null),
          description: item.description || "",
        }));
      } else {
        throw new Error(`${filter} API returned failure status`);
      }
    } catch (err) {
      console.error(`Error fetching ${filter}:`, err);
      return [];
    }
  };

  // Fetch new releases with pagination
  const fetchNewReleases = async () => {
    try {
      let allData = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await fetch(`${NEW_RELEASE_URL}?api_key=${API_KEY}&status=active&page=${currentPage}`);
        if (!response.ok) {
          throw new Error(`New Releases API error: ${response.status}`);
        }
        const json = await response.json();
        if (json.status === "success") {
          allData = [
            ...allData,
            ...json.data.map((item, index) => ({
              ...item,
              content_id: item.content_id || generateUniqueId(item, index),
              thumbnail_url: fixThumbnailUrl(item.thumbnail_url || null),
              description: item.description || "",
            })),
          ];
          totalPages = json.pagination?.total_pages || 1;
          currentPage++;
        } else {
          throw new Error("New Releases API returned failure status");
        }
      }
      return allData;
    } catch (err) {
      console.error("Error fetching new releases:", err);
      return [];
    }
  };

  // Fetch data and check for new user
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Check if user_id exists
        const storedId = await AsyncStorage.getItem("user_id");
        let isNewUser = false;

        if (!storedId) {
          // Insert new user
          const res = await fetch(USER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });

          if (!res.ok) {
            throw new Error(`User insert API error: ${res.status}`);
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("User insert API response is not valid JSON");
          }

          const json = await res.json();
          if (json.status === "success") {
            await AsyncStorage.setItem("user_id", String(json.user_id));
            isNewUser = true;
          } else {
            throw new Error(json.error || "Failed to create user");
          }
        }

        // Fetch content data
        const [banner, topShows, bingeWorthy, bollywoodBinge, dubbedInHindi, newReleases] = await Promise.all([
          fetchFilteredData("banner"),
          fetchFilteredData("top_shows"),
          fetchFilteredData("binge_worthy"),
          fetchFilteredData("bollywood_binge"),
          fetchFilteredData("dubbed_in_hindi"),
          fetchNewReleases(),
        ]);

        setBannerData(banner.length > 0 ? banner : [
          { content_id: '1', title: 'Featured Content', thumbnail_url: DEFAULT_IMAGE },
          { content_id: '2', title: 'Popular Series', thumbnail_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg' },
          { content_id: '3', title: 'New Movies', thumbnail_url: 'https://images.pexels.com/photos/7991328/pexels-photo-7991328.jpeg' }
        ]);
        setTopShowsData(topShows.length > 0 ? topShows : [
          { content_id: '4', title: 'Action Series', language: 'English', industry: 'Hollywood', thumbnail_url: DEFAULT_IMAGE },
          { content_id: '5', title: 'Comedy Show', language: 'Hindi', industry: 'Bollywood', thumbnail_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg' }
        ]);
        setBingeWorthyData(bingeWorthy);
        setBollywoodBingeData(bollywoodBinge);
        setDubbedInHindiData(dubbedInHindi);
        setNewReleaseData(newReleases);

        // Redirect to Profile screen for new users
        if (isNewUser) {
          navigation.navigate("MainTabs", { screen: "Home", params: { screen: "Profile" } });
        }
      } catch (err) {
        console.error("Fetch all data error:", err);
        setError(`Failed to load content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigation]);

  // Banner navigation handlers
  const handlePrevBanner = () => {
    if (currentBannerIndex > 0) {
      const newIndex = currentBannerIndex - 1;
      setCurrentBannerIndex(newIndex);
      bannerRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleNextBanner = () => {
    if (currentBannerIndex < bannerData.length - 1) {
      const newIndex = currentBannerIndex + 1;
      setCurrentBannerIndex(newIndex);
      bannerRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  // Update current index on scroll
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentBannerIndex(viewableItems[0].index);
    }
  }).current;

  // getItemLayout for banner FlatList
  const getBannerItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  // getItemLayout for section FlatList
  const getSectionItemLayout = (data, index) => ({
    length: 140 + 8, // card width (140) + margin (4 + 4)
    offset: (140 + 8) * index,
    index,
  });

  // Create listData dynamically
  const listData = [];

  if (bannerData.length > 0) {
    listData.push({ type: "slider", id: "slider" });
  }

  if (newReleaseData.length > 0) {
    listData.push({
      type: "section",
      id: "newreleases",
      title: "🔥 New Releases",
      items: newReleaseData,
    });
  }

  if (topShowsData.length > 0) {
    listData.push({
      type: "section",
      id: "topshows",
      title: "⭐ Top Shows",
      items: topShowsData,
    });
  }

  if (bingeWorthyData.length > 0) {
    listData.push({
      type: "section",
      id: "bingeworthy",
      title: "🍿 Binge Worthy",
      items: bingeWorthyData,
    });
  }

  if (bollywoodBingeData.length > 0) {
    listData.push({
      type: "section",
      id: "bollywoodbinge",
      title: "🎬 Bollywood Binge",
      items: bollywoodBingeData,
    });
  }

  if (dubbedInHindiData.length > 0) {
    listData.push({
      type: "section",
      id: "dubbedinhindi",
      title: "🗣️ Dubbed in Hindi",
      items: dubbedInHindiData,
    });
  }

  const renderSection = ({ item }) => {
    if (item.type === "slider") {
      return (
        <View style={styles.sliderContainer}>
          <FlatList
            ref={bannerRef}
            data={bannerData}
            horizontal
            pagingEnabled
            keyExtractor={(it) => it.content_id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: it }) => (
              <View style={styles.bannerItemContainer}>
                <Image
                  source={{ uri: fixThumbnailUrl(it.thumbnail_url) }}
                  style={styles.sliderImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                  style={styles.bannerGradient}
                />
              </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            getItemLayout={getBannerItemLayout}
            initialNumToRender={2}
            maxToRenderPerBatch={3}
            windowSize={5}
            removeClippedSubviews={true}
            decelerationRate="fast"
          />
          
          <View style={styles.sliderOverlay}>
            {/* <SubscribeShareButtons /> */}
          </View>
          
          <View style={styles.paginationContainer}>
            {bannerData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { opacity: index === currentBannerIndex ? 1 : 0.4 }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrevBanner}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNextBanner}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <FlatList
          horizontal
          data={item.items}
          keyExtractor={(it) => it.content_id.toString()}
          renderItem={({ item: it }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("ViewDetails", {
                  item: {
                    id: it.content_id.toString(),
                    title: it.title || "Unknown Title",
                    author: it.industry || "Unknown",
                    image: fixThumbnailUrl(it.thumbnail_url),
                    description: it.description || "",
                    main_category: it.main_category || "Unknown",
                    category: it.category || "Unknown",
                    language: it.language || "Unknown",
                    preference: it.preference || "Unknown",
                    plan_type: it.plan_type || "free", // Ensure plan_type is passed
                  },
                })
              }
            >
              <View style={styles.cardImageContainer}>
                <Image
                  source={{ uri: fixThumbnailUrl(it.thumbnail_url) }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={styles.cardGradient}
                />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {it.title}
                </Text>
                <Text style={styles.cardMeta}>
                  {it.language && it.language !== "Unknown" ? `${it.language}` : ""}
                  {it.industry && it.industry !== "Unknown" ? ` • ${it.industry}` : ""}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          getItemLayout={getSectionItemLayout}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          decelerationRate="fast"
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <LinearGradient
          colors={["#000", "#1a1a1a", "#000"]}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#e50914" />
          <Text style={styles.loadingText}>Loading amazing content...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.errorContent}>
          <Ionicons name="wifi-outline" size={60} color="#666" />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.replace("MainHome")} // Replace window.location.reload with navigation reset
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Darker modern background
  },
  mainContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FF6B35",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: "#FF6B35",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "#BBB",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Banner Styles
  sliderContainer: {
    marginBottom: 28,
    position: "relative",
  },
  bannerItemContainer: {
    width: width,
    height: width * 0.6,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "#1E1E1E",
  },
  bannerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
    borderRadius: 16,
  },
  sliderOverlay: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B35",
    marginHorizontal: 5,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -22 }],
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  prevButton: { left: 16 },
  nextButton: { right: 16 },

  // Button Styles
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  subscribeButton: {
    marginRight: 16,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 6,
  },
  subscribeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  subscribeText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  shareButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  shareButtonInner: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 12,
  },

  // Section Styles
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: "#FF6B35",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  horizontalListContent: {
    paddingHorizontal: 16,
  },

  // Card Styles
  card: {
    marginHorizontal: 6,
    width: 140,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
    elevation: 3,
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
  },
  playButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 107, 53, 0.9)",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  cardMeta: {
    color: "#BBB",
    fontSize: 11,
  },
});