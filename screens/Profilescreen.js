import React from "react";
import { View, Text, SafeAreaView, Pressable, StyleSheet } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>OTT Profile Screen</Text>
      <Text style={styles.subtitle}>
        This is your profile area. You can manage account & settings.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.buttonText}>Go to Settings</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#aaa",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FF7A00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});