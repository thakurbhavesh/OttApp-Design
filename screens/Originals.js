import React, { useState, useRef } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { Video } from "expo-av";

const { height } = Dimensions.get("window");

const videoData = [
  { id: "1", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "2", uri: "https://www.w3schools.com/html/movie.mp4" },
  { id: "3", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

export default function Originals() {
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleVideoIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

  return (
    <FlatList
      data={videoData}
      pagingEnabled
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            resizeMode="cover"
            shouldPlay={visibleVideoIndex === index}
            isLooping
          />
          <View style={styles.videoTextContainer}>
            <Text style={styles.videoText}>Video {item.id}</Text>
          </View>
        </View>
      )}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfigRef.current}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    height: height,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoTextContainer: {
    position: "absolute",
    bottom: 64,
    left: 20,
  },
  videoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});