import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../navigation/Header";
import MainHome from "./MainHome";

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Header badgeValue={65} />
      <MainHome />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Assuming bg-bg is a dark background
  },
});