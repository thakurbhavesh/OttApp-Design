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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Header from "../navigation/Header";


const { width } = Dimensions.get("window");

const IMAGE_URL =
  "https://cdn.pixabay.com/photo/2025/03/13/10/50/fall-9467534_1280.jpg";

const AUDIO_DATA = {
  "All Audio": [
    {
      section: "Top Songs",
      items: [
        {
          id: "1",
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
        },
        {
          id: "2",
          title: "Channa Mereya",
          artist: "Arijit Singh",
          image: "https://picsum.photos/800/400?1",
          audioUrl: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
          year: "2016",
          genre: "Romantic",
          duration: "04min 49sec",
          rating: "7.8",
          age: "All",
          description: "A heartfelt song from Ae Dil Hai Mushkil.",
          languages: "Hindi",
          advisory: "None",
        },
      ],
    },
    {
      section: "Popular Podcasts",
      items: [
        {
          id: "3",
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
        },
        {
          id: "4",
          title: "Poetry Sessions",
          artist: "Nevadit Chaudhary",
          image: "https://picsum.photos/800/400?3",
          year: "2023",
          genre: "Poetry",
          duration: "30min/ep",
          rating: "8.0",
          age: "All",
          description: "Soulful poetry readings and discussions.",
          languages: "Hindi",
          advisory: "None",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Love Poems",
              audioUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
              thumbnail: "https://picsum.photos/200/100?3",
              duration: "30min",
              description: "Exploring love through poetry.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Nature Poems",
              audioUrl: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
              thumbnail: "https://picsum.photos/200/100?4",
              duration: "32min",
              description: "Celebrating nature in verse.",
            },
          ],
        },
      ],
    },
  ],
  Music: [
    {
      section: "Bollywood Hits",
      items: [
        {
          id: "1",
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
        },
        {
          id: "2",
          title: "Channa Mereya",
          artist: "Arijit Singh",
          image: "https://picsum.photos/800/400?1",
          audioUrl: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
          year: "2016",
          genre: "Romantic",
          duration: "04min 49sec",
          rating: "7.8",
          age: "All",
          description: "A heartfelt song from Ae Dil Hai Mushkil.",
          languages: "Hindi",
          advisory: "None",
        },
      ],
    },
  ],
  Podcasts: [
    {
      section: "Trending Podcasts",
      items: [
        {
          id: "3",
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
        },
        {
          id: "4",
          title: "Poetry Sessions",
          artist: "Nevadit Chaudhary",
          image: "https://picsum.photos/800/400?3",
          year: "2023",
          genre: "Poetry",
          duration: "30min/ep",
          rating: "8.0",
          age: "All",
          description: "Soulful poetry readings and discussions.",
          languages: "Hindi",
          advisory: "None",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Love Poems",
              audioUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
              thumbnail: "https://picsum.photos/200/100?3",
              duration: "30min",
              description: "Exploring love through poetry.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Nature Poems",
              audioUrl: "https://www.kozco.com/tech/LRMonoPhase4.mp3",
              thumbnail: "https://picsum.photos/200/100?4",
              duration: "32min",
              description: "Celebrating nature in verse.",
            },
          ],
        },
      ],
    },
  ],
};

// Placeholder for SubscribeShareButtons (adapted from HomeScreen.js)
const SubscribeShareButtons = () => (
  <View style={styles.row}>
    <TouchableOpacity style={styles.subscribeBtn}>
      <Text style={styles.subscribeText}>Subscribe</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.shareBtn}
      onPress={() => Share.share({ message: "Check out this audio!" })}
    >
      <Ionicons name="share-outline" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Audio() {
  const [selectedTab, setSelectedTab] = useState("All Audio");
  const navigation = useNavigation();

  const renderSection = ({ item }) => {
    // Slider for featured audio
    if (item.type === "slider") {
      return (
        <View style={styles.sliderWrapper}>
          <FlatList
            data={AUDIO_DATA[selectedTab][0].items.slice(0, 3)}
            horizontal
            pagingEnabled
            keyExtractor={(it) => it.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ViewDetails", {
                    title: item.title,
                    image: item.image,
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
                    isAudio: true, // Flag to indicate audio content
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.sliderImage} />
              </TouchableOpacity>
            )}
          />
          <View style={styles.sliderOverlay}>
            <SubscribeShareButtons />
          </View>
        </View>
      );
    }

    // Audio sections
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{item.section}</Text>
        <FlatList
          horizontal
          data={item.items}
          keyExtractor={(it) => item.section + "-" + it.id}
          renderItem={({ item: it }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ViewDetails", {
                  title: it.title,
                  image: it.image,
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
                  isAudio: true, // Flag to indicate audio content
                })
              }
            >
              <Image source={{ uri: it.image }} style={styles.image} />
              <Text style={styles.title}>{it.title}</Text>
              <Text style={styles.author}>{it.artist}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  // Merge slider + selectedTab sections
  const listData = [{ type: "slider", id: "slider" }, ...AUDIO_DATA[selectedTab]];

  return (
    <View style={styles.container}>
      <Header />
 
      <View style={styles.tabContainer}>
        {["All Audio", "Music", "Podcasts"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[styles.tabText, selectedTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={listData}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    paddingVertical: 10,
  },
  tabText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTab: {
    color: "#F97316",
    borderBottomWidth: 2,
    borderBottomColor: "#F97316",
  },
  sliderWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  sliderImage: {
    width: width,
    height: width * (9 / 16), // 16:9 aspect ratio
    borderRadius: 12,
    marginRight: 10,
  },
  sliderOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 30,
  },
  subscribeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  subscribeText: {
    color: "#fff",
    marginLeft: 7,
    fontWeight: "600",
    fontSize: 15,
  },
  shareBtn: {
    backgroundColor: "#F97316",
    borderRadius: 20,
    padding: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
  },
  card: {
    marginHorizontal: 10,
    width: 140,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 5,
  },
  author: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});