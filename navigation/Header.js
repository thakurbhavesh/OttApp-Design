import React from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // Added useRoute
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// Example state/props (replace with actual logic)
const isSubscribed = false; // Replace with actual subscription status
const canUpgrade = true; // Replace with actual upgrade eligibility

export default function Header() {
  const navigation = useNavigation();
  const route = useRoute(); // To check current screen
  const insets = useSafeAreaInsets();

  // Check if current screen is Profile
  const isProfileScreen = route.name === "Profile";

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerRow}>
        <View style={styles.leftSection}>
          <Image
            source={{
              uri: "https://i.postimg.cc/Dz1cHhN9/Whats-App-Image-2025-08-24-at-1-42-02-PM-1.jpg",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("Search")}
          >
            <Icon name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.rightSection}>
          {/* Subscribe/Upgrade Button */}
          {isSubscribed ? (
            canUpgrade ? (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => navigation.navigate("Profile", { user: null })}
                activeOpacity={0.8}
              >
                <Icon name="chevron-forward" size={20} color="#fff" />
                <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
                <Icon name="chevron-forward" size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              !isProfileScreen && ( // Hide max plan message on Profile screen
                <View style={styles.maxPlanInfo}>
                  <Text style={styles.maxPlanText}>
                    You have the highest plan!
                  </Text>
                </View>
              )
            )
          ) : (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => navigation.navigate("Profile", { user: null })}
              activeOpacity={0.8}
            >
              <Icon name="diamond-outline" size={20} color="#fff" />
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              <Icon name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}
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
  leftSection: { flexDirection: "row", alignItems: "center" },
  logo: { width: 128, height: 32, marginRight: 12 },
  searchButton: { padding: 6 },
  rightSection: { flexDirection: "row", alignItems: "center" },
  subscribeButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subscribeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  upgradeButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  maxPlanInfo: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  maxPlanText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
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
