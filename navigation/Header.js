import React from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function Header() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerRow}>
        <Image
          source={{
            uri: "https://i.postimg.cc/Dz1cHhN9/Whats-App-Image-2025-08-24-at-1-42-02-PM-1.jpg",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="person-circle-outline" size={28} color="#FFFFFF" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>65</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#000000" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#000000",
    zIndex: 50,
  },
  logo: { width: 128, height: 32 },
  profileContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF0000",
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
});