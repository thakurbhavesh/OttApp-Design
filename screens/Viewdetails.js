import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video, AVPlaybackStatus } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const API_KEY = "your_secure_api_key";
const CONTENT_API_URL = "http://10.159.104.40/ott_app/AppApi/content_by_id.php";
const DEFAULT_IMAGE = "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg";

export default function ViewDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  const contentId = item?.id || "";

  const [content, setContent] = useState({
    title: item?.title || "Unknown Title",
    image: item?.thumbnail_url || DEFAULT_IMAGE,
    description: item?.description || "No description available",
    main_category_name: item?.main_category_name || "Unknown",
    category_name: item?.category_name || "Unknown",
    language_name: item?.language_name || "Unknown",
    preference_name: item?.preference_name || "Unknown",
    plan: item?.plan || "free",
    industry: item?.industry || "Unknown",
    video_url: item?.video_url || "",
    trailer_url: item?.trailer_url || "",
    cast_crew: item?.cast_crew || [],
    manage_selected: item?.manage_selected || [],
    duration: item?.duration ? `${item.duration} min` : "Unknown",
    release_date: item?.release_date || "Unknown",
  });

  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [paused, setPaused] = useState(true);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTab, setCurrentTab] = useState("episodes");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [expandedEpisodes, setExpandedEpisodes] = useState({}); // State to track expanded descriptions
  const videoRef = useRef(null);
  const defaultCastImage = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";

  const stripHtml = (html) => {
    return html ? html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "No description available";
  };

  const isValidVideoUrl = (url) => {
    return url && url !== "A" && url.trim() !== "" && url.startsWith("http");
  };

  const isPlayableEpisode = (episode) => {
    return episode && isValidVideoUrl(episode.video_url);
  };

  const fetchContent = async () => {
    if (!contentId) {
      setError("No content ID provided");
      setLoadingContent(false);
      return;
    }

    setLoadingContent(true);
    setError(null);
    try {
      const response = await fetch(
        `${CONTENT_API_URL}?api_key=${API_KEY}&content_id=${contentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Content API error: ${response.status} ${response.statusText}`);
      }
      const json = await response.json();
      if (json.status === "success" && json.data) {
        setContent({
          title: json.data.title || item?.title || "Unknown Title",
          image: json.data.thumbnail_url || item?.thumbnail_url || DEFAULT_IMAGE,
          description: json.data.description ? stripHtml(json.data.description) : item?.description || "No description available",
          main_category_name: json.data.main_category_name || item?.main_category_name || "Unknown",
          category_name: json.data.category_name || item?.category_name || "Unknown",
          language_name: json.data.language_name || item?.language_name || "Unknown",
          preference_name: json.data.preference_name || item?.preference_name || "Unknown",
          plan: json.data.plan || item?.plan || "free",
          industry: json.data.industry || item?.industry || "Unknown",
          video_url: json.data.video_url || item?.video_url || "",
          trailer_url: json.data.trailer_url || item?.trailer_url || "",
          cast_crew: json.data.cast_crew || item?.cast_crew || [],
          manage_selected: json.data.manage_selected || item?.manage_selected || [],
          duration: json.data.duration ? `${json.data.duration} min` : item?.duration || "Unknown",
          release_date: json.data.release_date || item?.release_date || "Unknown",
        });
      } else {
        setError(json.message || "Failed to load content details");
      }
    } catch (error) {
      console.error("Error fetching content:", error.message);
      setError(error.message);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentId, item]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (!status.isPlaying && !paused) {
        setPaused(true);
      } else if (status.isPlaying && paused) {
        setPaused(false);
      }
    } else if (status.error) {
      console.log("Playback error:", status.error);
      setError("Failed to play video: " + status.error);
    }
  };

  const playVideo = async (videoUrl) => {
    if (!isValidVideoUrl(videoUrl)) {
      console.warn("Invalid video URL:", videoUrl);
      setError("Invalid video URL. Please check the content settings.");
      return;
    }
    setCurrentVideoUrl(videoUrl);
    setShowVideo(true);
    setPaused(false);
    if (videoRef.current) {
      try {
        await videoRef.current.loadAsync({ uri: videoUrl }, { rate: playbackRate }, true);
        await videoRef.current.playAsync();
      } catch (e) {
        console.log("Play error:", e);
        setError("Failed to play video: " + e.message);
      }
    }
  };

  const changePlaybackRate = async (newRate) => {
    setPlaybackRate(newRate);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(newRate, true);
    }
  };

  const toggleEpisodeDescription = (episodeId) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
  };

  const renderEpisode = ({ item }) => {
    if (!isPlayableEpisode(item)) {
      return null;
    }

    const isExpanded = expandedEpisodes[item.id];
    const description = stripHtml(item.description);
    const isLongDescription = description.length > 100; // Adjust threshold as needed

    return (
      <TouchableOpacity
        style={styles.episodeCard}
        onPress={() => playVideo(item.video_url)}
        activeOpacity={0.9}
      >
        <View style={styles.episodeImageContainer}>
          <Image
            source={{ uri: item.thumbnail_url || content.image }}
            style={styles.episodeThumbnail}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.episodeGradient}
          />
          <View style={styles.episodePlayButton}>
            <Ionicons name="play" size={16} color="#fff" />
          </View>
        </View>
        <View style={styles.episodeInfo}>
          {(item.season_number > 0 || item.episode_number > 0) && (
            <Text style={styles.episodeNumber}>
              S{item.season_number} E{item.episode_number}
            </Text>
          )}
          <Text style={styles.episodeTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.episodeDuration}>
            {item.length ? `${item.length} min` : "Unknown"}
          </Text>
          <Text
            style={styles.episodeDescription}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {description}
          </Text>
          {isLongDescription && (
            <TouchableOpacity
              onPress={() => toggleEpisodeDescription(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.readMore}>
                {isExpanded ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCastCrew = ({ item }) => (
    <View style={styles.castCard}>
      <View style={styles.castImageContainer}>
        <Image
          source={{ uri: item.image || defaultCastImage }}
          style={styles.castImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.castGradient}
        />
      </View>
      <View style={styles.castInfo}>
        <Text style={styles.castName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.castRole} numberOfLines={1}>
          {item.role}
        </Text>
      </View>
    </View>
  );

  const hasPlayableEpisodes = content.manage_selected.some(episode => isPlayableEpisode(episode));
  const hasCastCrew = content.cast_crew.length > 0;

  const sections = [
    { type: 'hero', data: {} },
    { type: 'action', data: {} },
    { type: 'description', data: {} },
    { type: 'infoGrid', data: {} },
    ...(hasPlayableEpisodes || hasCastCrew ? [{ type: 'tabs', data: {} }] : []),
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'hero':
        return (
          <View style={styles.heroSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowVideo(false);
                setPaused(true);
                if (videoRef.current) {
                  videoRef.current.stopAsync();
                }
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} style={styles.backButtonBlur}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </BlurView>
            </TouchableOpacity>

            <View style={styles.posterWrapper}>
              {showVideo && currentVideoUrl ? (
                <View style={styles.videoContainer}>
                  <Video
                    ref={videoRef}
                    source={{ uri: currentVideoUrl }}
                    style={styles.video}
                    useNativeControls
                    isLooping={false}
                    resizeMode="contain"
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    onError={(e) => {
                      console.log("Video error:", e);
                      setError("Failed to load video");
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.playOverlay, { opacity: paused ? 1 : 0 }]}
                    onPress={() => {
                      setPaused(!paused);
                      if (videoRef.current) {
                        paused ? videoRef.current.playAsync() : videoRef.current.pauseAsync();
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#e50914', '#b20710']}
                      style={styles.playOverlayGradient}
                    >
                      <Ionicons
                        name={paused ? "play" : "pause"}
                        size={32}
                        color="#fff"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  <View style={styles.speedControls}>
                    {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                      <TouchableOpacity 
                        key={rate}
                        onPress={() => changePlaybackRate(rate)}
                        style={[
                          styles.speedButton,
                          playbackRate === rate && styles.activeSpeedButton
                        ]}
                      >
                        <Text style={[
                          styles.speedButtonText,
                          playbackRate === rate && styles.activeSpeedButtonText
                        ]}>
                          {rate}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.posterContainer}>
                  <Image
                    source={{ uri: content.image }}
                    style={styles.poster}
                    resizeMode="contain"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.posterGradient}
                  />
                </View>
              )}
            </View>

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)', '#000']}
              style={styles.contentOverlay}
            >
              <Text style={styles.title}>{content.title}</Text>
              <View style={styles.metaInfo}>
                <View style={styles.badges}>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>8.5</Text>
                  </View>
                  <View style={styles.yearBadge}>
                    <Text style={styles.yearText}>2024</Text>
                  </View>
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>{content.preference_name}</Text>
                  </View>
                  {content.plan === "paid" && (
                    <View style={styles.premiumBadge}>
                      <Ionicons name="diamond" size={12} color="#FFD700" />
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.subtitle}>
                  {content.main_category_name} • {content.language_name} • {content.duration}
                </Text>
              </View>
            </LinearGradient>
          </View>
        );

      case 'action':
        const firstPlayableEpisode = content.manage_selected.find(episode => isPlayableEpisode(episode));
        return (
          <View style={styles.actionSection}>
            <Pressable
              style={({ pressed }) => [
                styles.playButton,
                {
                  opacity:
                    content.main_category_name === "Webseries" || hasPlayableEpisodes
                      ? firstPlayableEpisode
                        ? pressed ? 0.8 : 1
                        : 0.5
                      : isValidVideoUrl(content.video_url)
                      ? pressed ? 0.8 : 1
                      : 0.5,
                },
              ]}
              onPress={() => {
                const videoToPlay = (content.main_category_name === "Webseries" || hasPlayableEpisodes) 
                  ? firstPlayableEpisode?.video_url 
                  : content.video_url;
                playVideo(videoToPlay);
              }}
              disabled={
                (content.main_category_name === "Webseries" || hasPlayableEpisodes)
                  ? !firstPlayableEpisode
                  : !isValidVideoUrl(content.video_url)
              }
            >
              <LinearGradient
                colors={['#e50914', '#b20710']}
                style={styles.playButtonGradient}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.playButtonText}>Play</Text>
              </LinearGradient>
            </Pressable>

            {content.trailer_url && (
              <Pressable
                style={({ pressed }) => [
                  styles.trailerButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => playVideo(content.trailer_url)}
              >
                <View style={styles.trailerButtonInner}>
                  <Ionicons name="play-outline" size={20} color="#fff" />
                  <Text style={styles.trailerButtonText}>Trailer</Text>
                </View>
              </Pressable>
            )}

            <View style={styles.secondaryActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsWatchlisted(!isWatchlisted)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isWatchlisted ? "checkmark-circle" : "add-circle-outline"} 
                  size={24} 
                  color={isWatchlisted ? "#e50914" : "#fff"} 
                />
                <Text style={styles.actionText}>
                  {isWatchlisted ? "Added" : "Watchlist"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? "#e50914" : "#fff"} 
                />
                <Text style={styles.actionText}>
                  {isLiked ? "Liked" : "Like"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={24} color="#fff" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                <Ionicons name="download-outline" size={24} color="#fff" />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'description':
        return (
          <View style={styles.descriptionSection}>
            <Text style={styles.description} numberOfLines={3}>
              {content.description}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowDescriptionModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.readMore}>Read more</Text>
            </TouchableOpacity>
          </View>
        );

      case 'infoGrid':
        return (
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Genre</Text>
              <Text style={styles.infoValue}>{content.category_name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Language</Text>
              <Text style={styles.infoValue}>{content.language_name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Industry</Text>
              <Text style={styles.infoValue}>{content.industry}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Release</Text>
              <Text style={styles.infoValue}>{content.release_date}</Text>
            </View>
          </View>
        );

      case 'tabs':
        return (
          <View style={styles.tabSection}>
            <View style={styles.tabBar}>
              {hasPlayableEpisodes && (
                <TouchableOpacity
                  style={[styles.tabButton, currentTab === "episodes" && styles.activeTab]}
                  onPress={() => setCurrentTab("episodes")}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      currentTab === "episodes" && styles.activeTabText,
                    ]}
                  >
                    Episodes
                  </Text>
                </TouchableOpacity>
              )}
              {hasCastCrew && (
                <TouchableOpacity
                  style={[styles.tabButton, currentTab === "info" && styles.activeTab]}
                  onPress={() => setCurrentTab("info")}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.tabText, currentTab === "info" && styles.activeTabText]}
                  >
                    Cast & Crew
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {currentTab === "episodes" && hasPlayableEpisodes ? (
              <View style={styles.episodeSection}>
                <FlatList
                  data={content.manage_selected}
                  renderItem={renderEpisode}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.episodeList}
                />
              </View>
            ) : currentTab === "episodes" && content.main_category_name === "Webseries" ? (
              <View style={styles.noDataContainer}>
                <Ionicons name="film-outline" size={48} color="#666" />
                <Text style={styles.noDataText}>No episodes available</Text>
              </View>
            ) : null}

            {currentTab === "info" && hasCastCrew ? (
              <View style={styles.castSection}>
                <FlatList
                  data={content.cast_crew}
                  renderItem={renderCastCrew}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.castList}
                />
              </View>
            ) : currentTab === "info" ? (
              <View style={styles.noDataContainer}>
                <Ionicons name="people-outline" size={48} color="#666" />
                <Text style={styles.noDataText}>No cast information available</Text>
              </View>
            ) : null}
          </View>
        );

      default:
        return null;
    }
  };

  if (loadingContent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <LinearGradient
          colors={['#000', '#1a1a1a', '#000']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#e50914" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <LinearGradient
          colors={['#000', '#1a1a1a', '#000']}
          style={styles.loadingContainer}
        >
          <Ionicons name="alert-circle-outline" size={60} color="#e50914" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoadingContent(true);
              setError(null);
              fetchContent();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#e50914', '#b20710']}
              style={styles.retryGradient}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDescriptionModal}
        onRequestClose={() => setShowDescriptionModal(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={20} style={styles.modalBlur}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowDescriptionModal(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Image
                source={{ uri: content.image }}
                style={styles.modalPoster}
                resizeMode="cover"
              />
              
              <Text style={styles.modalTitle}>{content.title}</Text>
              <Text style={styles.modalSubtitle}>
                {content.main_category_name} • {content.category_name}
              </Text>
              
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalDescription}>{content.description}</Text>
                
                <View style={styles.modalInfoGrid}>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Language</Text>
                    <Text style={styles.modalInfoValue}>{content.language_name}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Industry</Text>
                    <Text style={styles.modalInfoValue}>{content.industry}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Release Date</Text>
                    <Text style={styles.modalInfoValue}>{content.release_date}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Duration</Text>
                    <Text style={styles.modalInfoValue}>{content.duration}</Text>
                  </View>
                </View>
              </ScrollView>
              
              <Pressable
                style={({ pressed }) => [
                  styles.modalPlayButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => {
                  setShowDescriptionModal(false);
                  const videoToPlay = (content.main_category_name === "Webseries" || hasPlayableEpisodes) 
                    ? content.manage_selected.find(episode => isPlayableEpisode(episode))?.video_url 
                    : content.video_url;
                  playVideo(videoToPlay);
                }}
              >
                <LinearGradient
                  colors={['#e50914', '#b20710']}
                  style={styles.modalPlayButtonGradient}
                >
                  <Ionicons name="play" size={20} color="#fff" />
                  <Text style={styles.modalPlayButtonText}>Play Now</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Hero Section
  heroSection: {
    position: 'relative',
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonBlur: {
    padding: 12,
  },
  posterWrapper: {
    width: '100%',
    height: height * 0.6,
    position: 'relative',
  },
  posterContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  posterGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metaInfo: {
    gap: 12,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
    gap: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  yearBadge: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yearText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  ageBadge: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  premiumText: {
    color: "#FFD700",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "500",
  },

  // Video Player
  videoContainer: {
    width: width,
    height: height * 0.6,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    borderRadius: 40,
    overflow: 'hidden',
  },
  playOverlayGradient: {
    padding: 20,
  },
  speedControls: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  speedButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeSpeedButton: {
    backgroundColor: "#e50914",
    borderColor: "#e50914",
  },
  speedButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  activeSpeedButtonText: {
    color: "#fff",
  },

  // Action Section
  actionSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  playButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  trailerButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  trailerButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  trailerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  actionButton: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  // Description Section
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  description: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  readMore: {
    color: "#e50914",
    fontSize: 14,
    fontWeight: "600",
  },

  // Info Grid
  infoGrid: {
    paddingHorizontal: 20,
    paddingTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Tab Section
  tabSection: {
    paddingTop: 32,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: "#e50914",
  },
  tabText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },

  // Episodes
  episodeSection: {
    paddingHorizontal: 20,
  },
  episodeList: {
    gap: 16,
  },
  episodeCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: 'row',
  },
  episodeImageContainer: {
    width: 120,
    height: 80,
    position: 'relative',
  },
  episodeThumbnail: {
    width: "100%",
    height: "100%",
  },
  episodeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  episodePlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(229, 9, 20, 0.8)',
    borderRadius: 12,
    padding: 8,
  },
  episodeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  episodeNumber: {
    color: "#e50914",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  episodeTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  episodeDuration: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  episodeDescription: {
    color: "#ccc",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4, // Added margin for spacing before Read More
  },

  // Cast Section
  castSection: {
    paddingLeft: 20,
  },
  castList: {
    gap: 16,
    paddingRight: 20,
  },
  castCard: {
    alignItems: "center",
    width: 100,
  },
  castImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  castImage: {
    width: "100%",
    height: "100%",
  },
  castGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
  },
  castInfo: {
    alignItems: "center",
  },
  castName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: 'center',
    marginBottom: 2,
  },
  castRole: {
    color: "#999",
    fontSize: 10,
    textAlign: 'center',
  },

  // No Data
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  closeModalButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  modalPoster: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  modalScrollView: {
    maxHeight: 200,
    marginBottom: 20,
  },
  modalDescription: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalInfoGrid: {
    gap: 12,
  },
  modalInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalInfoLabel: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  modalInfoValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  modalPlayButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  modalPlayButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  modalPlayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});