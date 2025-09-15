import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Live() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Live Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});