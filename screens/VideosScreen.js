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

const VIDEO_DATA = {
  "All Videos": [
    {
      section: "Top Movies",
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
        },
        {
          id: "2",
          title: "Dhoom 2",
          author: "Sanjay Gadhvi",
          image: "https://picsum.photos/800/400?1",
          videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          year: "2006",
          genre: "Action",
          duration: "02h 32min",
          rating: "6.5",
          age: "13+",
          description: "A high-octane action thriller with Hrithik Roshan.",
          languages: "Hindi",
          advisory: "Violence",
        },
      ],
    },
    {
      section: "Popular Web Series",
      items: [
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
        },
        {
          id: "4",
          title: "Mirzapur",
          author: "Puneet Krishna",
          image: "https://picsum.photos/800/400?3",
          year: "2018",
          genre: "Crime",
          duration: "45min/ep",
          rating: "8.4",
          age: "18+",
          description: "A tale of power and violence in the heartland.",
          languages: "Hindi",
          advisory: "Violence, Language",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Jhandu",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              thumbnail: "https://picsum.photos/200/100?3",
              duration: "45min",
              description: "Kaleen Bhaiya's empire faces a challenge.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Gooda",
              videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              thumbnail: "https://picsum.photos/200/100?4",
              duration: "47min",
              description: "Guddu and Bablu take a stand.",
            },
          ],
        },
      ],
    },
  ],
  Movies: [
    {
      section: "Bollywood Hits",
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
        },
        {
          id: "2",
          title: "Dhoom 2",
          author: "Sanjay Gadhvi",
          image: "https://picsum.photos/800/400?1",
          videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          year: "2006",
          genre: "Action",
          duration: "02h 32min",
          rating: "6.5",
          age: "13+",
          description: "A high-octane action thriller with Hrithik Roshan.",
          languages: "Hindi",
          advisory: "Violence",
        },
      ],
    },
  ],
  "Web Series": [
    {
      section: "Trending Series",
      items: [
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
        },
        {
          id: "4",
          title: "Mirzapur",
          author: "Puneet Krishna",
          image: "https://picsum.photos/800/400?3",
          year: "2018",
          genre: "Crime",
          duration: "45min/ep",
          rating: "8.4",
          age: "18+",
          description: "A tale of power and violence in the heartland.",
          languages: "Hindi",
          advisory: "Violence, Language",
          episodes: [
            {
              id: "1",
              episodeNumber: "Episode 1",
              title: "Jhandu",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              thumbnail: "https://picsum.photos/200/100?3",
              duration: "45min",
              description: "Kaleen Bhaiya's empire faces a challenge.",
            },
            {
              id: "2",
              episodeNumber: "Episode 2",
              title: "Gooda",
              videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              thumbnail: "https://picsum.photos/200/100?4",
              duration: "47min",
              description: "Guddu and Bablu take a stand.",
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
      onPress={() => Share.share({ message: "Check out this video!" })}
    >
      <Ionicons name="share-outline" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Videos() {
  const [selectedTab, setSelectedTab] = useState("All Videos");
  const navigation = useNavigation();

  const renderSection = ({ item }) => {
    // Slider for featured videos
    if (item.type === "slider") {
      return (
        <View style={styles.sliderWrapper}>
          <FlatList
            data={VIDEO_DATA[selectedTab][0].items.slice(0, 3)}
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
                    videoUrl: item.videoUrl,
                    year: item.year,
                    genre: item.genre,
                    duration: item.duration,
                    rating: item.rating,
                    age: item.age,
                    description: item.description,
                    languages: item.languages,
                    advisory: item.advisory,
                    episodes: item.episodes || [],
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

    // Video sections
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
                  videoUrl: it.videoUrl,
                  year: it.year,
                  genre: it.genre,
                  duration: it.duration,
                  rating: it.rating,
                  age: it.age,
                  description: it.description,
                  languages: it.languages,
                  advisory: it.advisory,
                  episodes: it.episodes || [],
                })
              }
            >
              <Image source={{ uri: it.image }} style={styles.image} />
              <Text style={styles.title}>{it.title}</Text>
              <Text style={styles.author}>{it.author}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  // Merge slider + selectedTab sections
  const listData = [{ type: "slider", id: "slider" }, ...VIDEO_DATA[selectedTab]];

  return (
    <View style={styles.container}>
      <Header />
   
      <View style={styles.tabContainer}>
        {["All Videos", "Movies", "Web Series"].map((tab) => (
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