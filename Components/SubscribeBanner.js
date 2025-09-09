import React from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";

export function SubscribeBanner({ onSubscribe }) {
  return (
    <View
      style={[
        styles.container,
        Platform.OS === "ios" ? styles.paddingBottomIOS : styles.paddingBottom,
      ]}
      accessibilityRole="summary"
      accessibilityLabel="Subscription prompt"
    >
      {/* Copy */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Unlock unlimited downloads/streaming
        </Text>
        <Text style={styles.subtitle}>
          Go ad-free and stream in top quality.
        </Text>
      </View>

      {/* CTA Button */}
      <Pressable
        onPress={onSubscribe}
        style={({ pressed }) => [styles.button, pressed ? styles.buttonActive : null]}
      >
        <Text style={styles.buttonText}>
          Subscribe Now
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  paddingBottomIOS: {
    paddingBottom: 24,
  },
  paddingBottom: {
    paddingBottom: 16,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#FF9500",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#1B100A",
    fontWeight: "700",
    fontSize: 14,
  },
});