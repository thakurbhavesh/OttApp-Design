import React from "react";
import { View, Text, SafeAreaView, Pressable, StyleSheet } from "react-native";

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        Here you can manage notifications, language, and privacy options.
      </Text>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Profile</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  description: {
    color: "#aaa",
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});