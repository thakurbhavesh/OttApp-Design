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
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const API_KEY = "your_secure_api_key"; // Replace with your actual API key
const BASE_URL = "http://10.205.61.40/ott_app/AppApi/show_content.php";
const NEW_RELEASE_URL = "http://10.205.61.40/ott_app/AppApi/new_releases.php";
const USER_API = "http://10.205.61.40/ott_app/AppApi/insert_user.php";
const DEFAULT_IMAGE = "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg";

function ShareButton() {
  return (
    <View style={styles.buttonContainer}>
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
  const [newReleaseData, setNewReleaseData] = useState([]);
  const [topShowsData, setTopShowsData] = useState([]);
  const [bingeWorthyData, setBingeWorthyData] = useState([]);
  const [bollywoodBingeData, setBollywoodBingeData] = useState([]);
  const [dubbedInHindiData, setDubbedInHindiData] = useState([]);
  const [allInOnePodcastData, setAllInOnePodcastData] = useState([]);
  const [catchmeTvOriginalsData, setCatchmeTvOriginalsData] = useState([]);
  const [dailyShowsData, setDailyShowsData] = useState([]);
  const [villainBabaShowData, setVillainBabaShowData] = useState([]);
  const [no1VerticalShowsData, setNo1VerticalShowsData] = useState([]);
  const [satrakRahoData, setSatrakRahoData] = useState([]);
  const [topWebSeriesData, setTopWebSeriesData] = useState([]);
  const [topShortFilmsData, setTopShortFilmsData] = useState([]);
  const [bhojpuriData, setBhojpuriData] = useState([]);
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
      }, 6000);
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [currentBannerIndex, bannerData.length]);

  // Fetch data for a specific filter with debugging
  const fetchFilteredData = async (filter) => {
    try {
      // console.log(`Fetching ${filter} data...`);
      const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&status=active&${filter}=1`);
      if (!response.ok) throw new Error(`${filter} API error: ${response.status}`);
      const json = await response.json();
      // console.log(`Response for ${filter}:`, json);
      if (json.status === "success" && Array.isArray(json.data)) {
        return json.data.map((item, index) => ({
          ...item,
          content_id: item.content_id || generateUniqueId(item, index),
          thumbnail_url: fixThumbnailUrl(item.thumbnail_url || null),
          description: item.description || "",
        }));
      } else {
        console.warn(`${filter} API returned no data or invalid structure`);
        return [];
      }
    } catch (err) {
      console.error(`Error fetching ${filter}:`, err);
      return [];
    }
  };

  // Fetch new releases with pagination
  const fetchNewReleases = async () => {
    try {
      // console.log("Fetching new releases...");
      let allData = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await fetch(`${NEW_RELEASE_URL}?api_key=${API_KEY}&status=active&page=${currentPage}`);
        if (!response.ok) throw new Error(`New Releases API error: ${response.status}`);
        const json = await response.json();
        // console.log(`New Releases page ${currentPage} response:`, json);
        if (json.status === "success" && Array.isArray(json.data)) {
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
        const storedId = await AsyncStorage.getItem("user_id");
        let isNewUser = false;

        if (!storedId) {
          const res = await fetch(USER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (!res.ok) throw new Error(`User insert API error: ${res.status}`);
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json"))
            throw new Error("User insert API response is not valid JSON");
          const json = await res.json();
          if (json.status === "success") {
            await AsyncStorage.setItem("user_id", String(json.user_id));
            isNewUser = true;
          } else throw new Error(json.error || "Failed to create user");
        }

        const [
          banner,
          newReleases,
          topShows,
          bingeWorthy,
          bollywoodBinge,
          dubbedInHindi,
          allInOnePodcast,
          catchmeTvOriginals,
          dailyShows,
          villainBabaShow,
          no1VerticalShows,
          satrakRaho,
          topWebSeries,
          topShortFilms,
          bhojpuri,
        ] = await Promise.all([
          fetchFilteredData("banner"),
          fetchNewReleases(),
          fetchFilteredData("top_shows"),
          fetchFilteredData("binge_worthy"),
          fetchFilteredData("bollywood_binge"),
          fetchFilteredData("dubbed_in_hindi"),
          fetchFilteredData("all_in_one_podcast"),
          fetchFilteredData("catchme_tv_originals"),
          fetchFilteredData("daily_shows"), // Updated from daily_shops
          fetchFilteredData("villain_baba_show"),
          fetchFilteredData("no1_vertical_shows"),
          fetchFilteredData("satrak_raho"),
          fetchFilteredData("top_web_series"),
          fetchFilteredData("top_short_films"),
          fetchFilteredData("bhojpuri"),
        ]);

        // console.log("Fetched data:", {
        //   banner: banner.length,
        //   newReleases: newReleases.length,
        //   topShows: topShows.length,
        //   bingeWorthy: bingeWorthy.length,
        //   bollywoodBinge: bollywoodBinge.length,
        //   dubbedInHindi: dubbedInHindi.length,
        //   allInOnePodcast: allInOnePodcast.length,
        //   catchmeTvOriginals: catchmeTvOriginals.length,
        //   dailyShows: dailyShows.length, // Updated state name
        //   villainBabaShow: villainBabaShow.length,
        //   no1VerticalShows: no1VerticalShows.length,
        //   satrakRaho: satrakRaho.length,
        //   topWebSeries: topWebSeries.length,
        //   topShortFilms: topShortFilms.length,
        //   bhojpuri: bhojpuri.length,
        // });

        setBannerData(banner.length > 0 ? banner : [
          { content_id: '1', title: 'Featured Content', thumbnail_url: DEFAULT_IMAGE },
          { content_id: '2', title: 'Popular Series', thumbnail_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg' },
          { content_id: '3', title: 'New Movies', thumbnail_url: 'https://images.pexels.com/photos/7991328/pexels-photo-7991328.jpeg' },
        ]);
        setNewReleaseData(newReleases);
        setTopShowsData(topShows.length > 0 ? topShows : [
          { content_id: '4', title: 'Action Series', language: 'English', industry: 'Hollywood', thumbnail_url: DEFAULT_IMAGE },
          { content_id: '5', title: 'Comedy Show', language: 'Hindi', industry: 'Bollywood', thumbnail_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg' },
        ]);
        setBingeWorthyData(bingeWorthy);
        setBollywoodBingeData(bollywoodBinge);
        setDubbedInHindiData(dubbedInHindi);
        setAllInOnePodcastData(allInOnePodcast);
        setCatchmeTvOriginalsData(catchmeTvOriginals);
        setDailyShowsData(dailyShows); // Updated state name
        setVillainBabaShowData(villainBabaShow);
        setNo1VerticalShowsData(no1VerticalShows);
        setSatrakRahoData(satrakRaho);
        setTopWebSeriesData(topWebSeries);
        setTopShortFilmsData(topShortFilms);
        setBhojpuriData(bhojpuri);

        if (isNewUser) navigation.navigate("MainTabs", { screen: "Home", params: { screen: "Profile" } });
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
    if (viewableItems.length > 0) setCurrentBannerIndex(viewableItems[0].index);
  }).current;

  // getItemLayout for banner FlatList
  const getBannerItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  // getItemLayout for section FlatList
  const getSectionItemLayout = (data, index) => ({
    length: 160 + 8, // Increased card width to 160 + margin (4 + 4)
    offset: (160 + 8) * index,
    index,
  });

  // Create listData in specified sequence
  const listData = [];

  // Banner section (always first)
  if (bannerData.length > 0) listData.push({ type: "slider", id: "slider" });

  // Sections in the specified sequence
  if (newReleaseData.length > 0)
    listData.push({
      type: "section",
      id: "newreleases",
      title: "🔥 New Releases",
      items: newReleaseData,
    });
  if (topShowsData.length > 0)
    listData.push({
      type: "section",
      id: "topshows",
      title: "⭐ Top Shows",
      items: topShowsData,
    });
  if (bingeWorthyData.length > 0)
    listData.push({
      type: "section",
      id: "bingeworthy",
      title: "🍿 Binge Worthy",
      items: bingeWorthyData,
    });
  if (bollywoodBingeData.length > 0)
    listData.push({
      type: "section",
      id: "bollywoodbinge",
      title: "🎬 Bollywood Binge",
      items: bollywoodBingeData,
    });
  if (dubbedInHindiData.length > 0)
    listData.push({
      type: "section",
      id: "dubbedinhindi",
      title: "🗣️ Dubbed in Hindi",
      items: dubbedInHindiData,
    });
  if (allInOnePodcastData.length > 0)
    listData.push({
      type: "section",
      id: "allinonepodcast",
      title: "🎙️ All In One Podcast",
      items: allInOnePodcastData,
    });
  if (catchmeTvOriginalsData.length > 0)
    listData.push({
      type: "section",
      id: "catchmetvoriginals",
      title: "🎥 Catchme TV Originals",
      items: catchmeTvOriginalsData,
    });
  if (dailyShowsData.length > 0) // Updated state name
    listData.push({
      type: "section",
      id: "dailyshows",
      title: "🛒 Daily Shows",
      items: dailyShowsData,
    });
  if (villainBabaShowData.length > 0)
    listData.push({
      type: "section",
      id: "villainbabashow",
      title: "😈 The Villain Baba Show",
      items: villainBabaShowData,
    });
  if (no1VerticalShowsData.length > 0)
    listData.push({
      type: "section",
      id: "no1verticalshows",
      title: "📱 No 1 Vertical Shows",
      items: no1VerticalShowsData,
    });
  if (satrakRahoData.length > 0)
    listData.push({
      type: "section",
      id: "satrakraho",
      title: "🚨 Satrak Raho",
      items: satrakRahoData,
    });
  if (topWebSeriesData.length > 0)
    listData.push({
      type: "section",
      id: "topwebseries",
      title: "📺 Top Web Series",
      items: topWebSeriesData,
    });
  if (topShortFilmsData.length > 0)
    listData.push({
      type: "section",
      id: "topshortfilms",
      title: "🎥 Top Short Films",
      items: topShortFilmsData,
    });
  if (bhojpuriData.length > 0)
    listData.push({
      type: "section",
      id: "bhojpuri",
      title: "🎶 Bhojpuri",
      items: bhojpuriData,
    });

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
              <TouchableOpacity
                style={styles.bannerItemContainer}
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
                      plan_type: it.plan_type || "free",
                    },
                  })
                }
              >
                <Image
                  source={{ uri: fixThumbnailUrl(it.thumbnail_url) }}
                  style={styles.sliderImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                  style={styles.bannerGradient}
                />
              </TouchableOpacity>
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
            <ShareButton />
          </View>
          <View style={styles.paginationContainer}>
            {bannerData.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, { opacity: index === currentBannerIndex ? 1 : 0.4 }]}
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
                    plan_type: it.plan_type || "free",
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
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
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
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No items available</Text>
          )}
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
            onPress={() => navigation.replace("MainHome")}
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sections available</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#BBB",
    fontSize: 16,
    textAlign: "center",
  },
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
  card: {
    marginHorizontal: 6,
    width: 140, // Reverted to original width
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
    elevation: 3, // Reverted to original elevation
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 200, // Reverted to original height
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
    fontSize: 12,
    backgroundColor: "transparent",
  },
});