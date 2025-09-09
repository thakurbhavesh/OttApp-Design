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

const { width, height } = Dimensions.get("window");

const API_KEY = "your_secure_api_key"; // Replace with your actual API key
const BASE_URL = "http://10.159.104.40/ott_app/AppApi/show_content.php";
const NEW_RELEASE_URL = "http://10.159.104.40/ott_app/AppApi/new_releases.php";
const DEFAULT_IMAGE = "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg";

function SubscribeShareButtons() {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.subscribeButton}>
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
    return url.replace("http://localhost/ott_app", "http://10.159.104.40/ott_app");
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

  // Fetch data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error("Fetch all data error:", err);
        setError("Failed to load content. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
            <SubscribeShareButtons />
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
                    plan_type: it.plan_type || "Unknown",
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
            onPress={() => window.location.reload()} // Note: window.location.reload is web-specific; use a different approach for mobile
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
    backgroundColor: "#000",
  },
  mainContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: "#e50914",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Banner Styles
  sliderContainer: {
    marginBottom: 32,
    position: "relative",
  },
  bannerItemContainer: {
    width: width,
    height: width * 0.65,
    position: "relative",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
  },
  bannerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  sliderOverlay: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -22 }],
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  
  // Button Styles
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeButton: {
    marginRight: 16,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  subscribeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subscribeText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  shareButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  shareButtonInner: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  
  // Section Styles
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 20,
    letterSpacing: 0.5,
  },
  horizontalListContent: {
    paddingHorizontal: 16,
  },
  
  // Card Styles
  card: {
    marginHorizontal: 4,
    width: 140,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  playButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardContent: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  cardMeta: {
    color: "#999",
    fontSize: 12,
    lineHeight: 16,
  },
});