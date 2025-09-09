import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Share,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../navigation/Header";
import TopTabs from "../navigation/TopTabs";

const { width } = Dimensions.get("window");

const IMAGE_URL =
  "https://cdn.pixabay.com/photo/2025/03/13/10/50/fall-9467534_1280.jpg";

const LIBRARY_DATA = {
  All: [
    {
      section: "Watchlist Videos",
      items: [
        {
          id: "1",
          title: "Humko Deewana Kar Gaye",
          author: "Raj Kanwar",
          image: IMAGE_URL,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          year: "2006",
          genre: "Romance",
          duration: "02h 29min",
          rating: "6.0",
          age: "18+",
          description: "A Bollywood romance film starring Akshay Kumar and Katrina Kaif.",
          languages: "Hindi",
          advisory: "Abusive Language, Smoking",
          isAudio: false,
        },
        {
          id: "3",
          title: "Sacred Games",
          author: "Anurag Kashyap",
          image: "https://picsum.photos/800/400?2",
          year: "2018",
          genre: "Crime",
          duration: "50min/ep",
          rating: "8.5",
          age: "18+",
          description: "A gritty crime drama set in Mumbai's underworld.",
          languages: "Hindi, English",
          advisory: "Violence, Nudity",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Ashwatthama",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              thumbnail: "https://picsum.photos/200/100?1",
              duration: "50min",
              description: "Sartaj Singh receives a mysterious tip.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Halahala",
              videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              thumbnail: "https://picsum.photos/200/100?2",
              duration: "48min",
              description: "Sartaj digs deeper into Gaitonde's past.",
            },
          ],
          isAudio: false,
        },
      ],
    },
    {
      section: "Watchlist Audio",
      items: [
        {
          id: "5",
          title: "Tum Hi Ho",
          artist: "Arijit Singh",
          image: IMAGE_URL,
          audioUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
          year: "2013",
          genre: "Romantic",
          duration: "04min 22sec",
          rating: "8.0",
          age: "All",
          description: "A soulful romantic track from Aashiqui 2.",
          languages: "Hindi",
          advisory: "None",
          isAudio: true,
        },
        {
          id: "7",
          title: "WTF is with Nikhil",
          artist: "Nikhil Kamath",
          image: "https://picsum.photos/800/400?2",
          year: "2023",
          genre: "Business",
          duration: "45min/ep",
          rating: "8.5",
          age: "13+",
          description: "Insights into business and entrepreneurship.",
          languages: "English",
          advisory: "None",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Starting Up",
              audioUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
              thumbnail: "https://picsum.photos/200/100?1",
              duration: "45min",
              description: "Nikhil discusses startup challenges.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Scaling Up",
              audioUrl: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
              thumbnail: "https://picsum.photos/200/100?2",
              duration: "48min",
              description: "Strategies for business growth.",
            },
          ],
          isAudio: true,
        },
      ],
    },
  ],
  Watchlist: [
    {
      section: "Saved Videos",
      items: [
        {
          id: "1",
          title: "Humko Deewana Kar Gaye",
          author: "Raj Kanwar",
          image: IMAGE_URL,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          year: "2006",
          genre: "Romance",
          duration: "02h 29min",
          rating: "6.0",
          age: "18+",
          description: "A Bollywood romance film starring Akshay Kumar and Katrina Kaif.",
          languages: "Hindi",
          advisory: "Abusive Language, Smoking",
          isAudio: false,
        },
        {
          id: "3",
          title: "Sacred Games",
          author: "Anurag Kashyap",
          image: "https://picsum.photos/800/400?2",
          year: "2018",
          genre: "Crime",
          duration: "50min/ep",
          rating: "8.5",
          age: "18+",
          description: "A gritty crime drama set in Mumbai's underworld.",
          languages: "Hindi, English",
          advisory: "Violence, Nudity",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Ashwatthama",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              thumbnail: "https://picsum.photos/200/100?1",
              duration: "50min",
              description: "Sartaj Singh receives a mysterious tip.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Halahala",
              videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              thumbnail: "https://picsum.photos/200/100?2",
              duration: "48min",
              description: "Sartaj digs deeper into Gaitonde's past.",
            },
          ],
          isAudio: false,
        },
      ],
    },
    {
      section: "Saved Audio",
      items: [
        {
          id: "5",
          title: "Tum Hi Ho",
          artist: "Arijit Singh",
          image: IMAGE_URL,
          audioUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
          year: "2013",
          genre: "Romantic",
          duration: "04min 22sec",
          rating: "8.0",
          age: "All",
          description: "A soulful romantic track from Aashiqui 2.",
          languages: "Hindi",
          advisory: "None",
          isAudio: true,
        },
        {
          id: "7",
          title: "WTF is with Nikhil",
          artist: "Nikhil Kamath",
          image: "https://picsum.photos/800/400?2",
          year: "2023",
          genre: "Business",
          duration: "45min/ep",
          rating: "8.5",
          age: "13+",
          description: "Insights into business and entrepreneurship.",
          languages: "English",
          advisory: "None",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Starting Up",
              audioUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
              thumbnail: "https://picsum.photos/200/100?1",
              duration: "45min",
              description: "Nikhil discusses startup challenges.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Scaling Up",
              audioUrl: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
              thumbnail: "https://picsum.photos/200/100?2",
              duration: "48min",
              description: "Strategies for business growth.",
            },
          ],
          isAudio: true,
        },
      ],
    },
  ],
  Downloads: [
    {
      section: "Downloaded Videos",
      items: [
        {
          id: "1",
          title: "Humko Deewana Kar Gaye",
          author: "Raj Kanwar",
          image: IMAGE_URL,
          videoUrl: "file://path/to/downloaded/humko_deewana.mp4", // Replace with actual file path
          year: "2006",
          genre: "Romance",
          duration: "02h 29min",
          rating: "6.0",
          age: "18+",
          description: "A Bollywood romance film starring Akshay Kumar and Katrina Kaif.",
          languages: "Hindi",
          advisory: "Abusive Language, Smoking",
          isAudio: false,
        },
      ],
    },
    {
      section: "Downloaded Audio",
      items: [
        {
          id: "5",
          title: "Tum Hi Ho",
          artist: "Arijit Singh",
          image: IMAGE_URL,
          audioUrl: "file://path/to/downloaded/tum_hi_ho.mp3", // Replace with actual file path
          year: "2013",
          genre: "Romantic",
          duration: "04min 22sec",
          rating: "8.0",
          age: "All",
          description: "A soulful romantic track from Aashiqui 2.",
          languages: "Hindi",
          advisory: "None",
          isAudio: true,
        },
      ],
    },
  ],
};

// Placeholder for PlayButton
const PlayButton = ({ onPress }) => (
  <TouchableOpacity style={styles.playBtn} onPress={onPress}>
    <Ionicons name="play" size={24} color="#fff" />
    <Text style={styles.playBtnText}>Play</Text>
  </TouchableOpacity>
);

export default function Library() {
  const [selectedTab, setSelectedTab] = useState("All");
  const navigation = useNavigation();
  const scaleAnims = ["All", "Watchlist", "Downloads"].reduce((acc, tab) => {
    acc[tab] = new Animated.Value(1);
    return acc;
  }, {});

  const handleTabPress = (tab) => {
    Animated.sequence([
      Animated.timing(scaleAnims[tab], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[tab], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedTab(tab);
  };

  const renderSection = ({ item }) => {
    // Slider for featured library content
    if (item.type === "slider") {
      return (
        <View style={styles.sliderWrapper}>
          <FlatList
            data={LIBRARY_DATA[selectedTab][0].items.slice(0, 3)}
            horizontal
            pagingEnabled
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sliderItem}
                onPress={() =>
                  navigation.navigate("ViewDetails", {
                    title: item.title,
                    image: item.image,
                    videoUrl: item.videoUrl,
                    audioUrl: item.audioUrl,
                    year: item.year,
                    genre: item.genre,
                    duration: item.duration,
                    rating: item.rating,
                    age: item.age,
                    description: item.description,
                    languages: item.languages,
                    advisory: item.advisory,
                    episodes: item.episodes || [],
                    isAudio: item.isAudio,
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.sliderImage} />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.sliderOverlay}
                >
                  <Text style={styles.sliderTitle}>{item.title}</Text>
                  <PlayButton
                    onPress={() =>
                      navigation.navigate("ViewDetails", {
                        title: item.title,
                        image: item.image,
                        videoUrl: item.videoUrl,
                        audioUrl: item.audioUrl,
                        year: item.year,
                        genre: item.genre,
                        duration: item.duration,
                        rating: item.rating,
                        age: item.age,
                        description: item.description,
                        languages: item.languages,
                        advisory: item.advisory,
                        episodes: item.episodes || [],
                        isAudio: item.isAudio,
                      })
                    }
                  />
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }

    // Library sections
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{item.section}</Text>
        <FlatList
          horizontal
          data={item.items}
          keyExtractor={(it) => item.section + "-" + it.id}
          renderItem={({ item: it }) => {
            const scaleAnim = new Animated.Value(1);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  Animated.sequence([
                    Animated.timing(scaleAnim, {
                      toValue: 0.95,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                      toValue: 1,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  navigation.navigate("ViewDetails", {
                    title: it.title,
                    image: it.image,
                    videoUrl: it.videoUrl,
                    audioUrl: it.audioUrl,
                    year: it.year,
                    genre: it.genre,
                    duration: it.duration,
                    rating: it.rating,
                    age: it.age,
                    description: it.description,
                    languages: it.languages,
                    advisory: it.advisory,
                    episodes: it.episodes || [],
                    isAudio: it.isAudio,
                  });
                }}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <Image source={{ uri: it.image }} style={styles.cardImage} />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.cardOverlay}
                  >
                    <Text style={styles.cardTitle}>{it.title}</Text>
                    <Text style={styles.cardAuthor}>{it.artist || it.author}</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  // Merge slider + selectedTab sections
  const listData = [{ type: "slider", id: "slider" }, ...LIBRARY_DATA[selectedTab]];

  return (
    <LinearGradient
      colors={["#141414", "#1F1F1F"]}
      style={styles.container}
    >
      <Header />
      <TopTabs initialRouteName="Library" />
      <View style={styles.tabContainer}>
        {["All", "Watchlist", "Downloads"].map((tab) => (
          <Animated.View
            key={tab}
            style={{ transform: [{ scale: scaleAnims[tab] }] }}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton,
              ]}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <FlatList
        data={listData}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: "#2A2A2A",
  },
  activeTabButton: {
    backgroundColor: "#E50914",
  },
  tabText: {
    color: "#B3B3B3",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  sliderWrapper: {
    marginBottom: 24,
  },
  sliderItem: {
    width: width,
    height: width * (9 / 16), // 16:9 aspect ratio
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  sliderOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  sliderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E50914",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  playBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    width: 180,
    marginRight: 12,
  },
  cardImage: {
    width: 180,
    height: 100, // 16:9 aspect ratio
    borderRadius: 8,
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cardAuthor: {
    color: "#B3B3B3",
    fontSize: 12,
  },
});