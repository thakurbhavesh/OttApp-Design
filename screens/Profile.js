import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../navigation/Header";
import TopTabs from "../navigation/TopTabs";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <TopTabs />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.username}>grumpyoctopus94</Text>
          <View style={styles.coinRow}>
            <Icon name="wallet-outline" size={20} color="#fff" />
            <Text style={styles.coinText}>65 Coins</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Earn Coins</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="gift-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Redeem Coins</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>Subscribe to Hungama Premium</Text>
          <Text style={styles.subscribeSubtext}>Unlock exclusive content!</Text>
        </TouchableOpacity>

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="notifications-outline" size={20} color="#ccc" />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="stats-chart-outline" size={20} color="#ccc" />
            <Text style={styles.settingText}>App Usage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="warning-outline" size={20} color="#ccc" />
            <Text style={styles.settingText}>Explicit Content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="musical-notes-outline" size={20} color="#ccc" />
            <Text style={styles.settingText}>Audio Quality</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="videocam-outline" size={20} color="#ccc" />
            <Text style={styles.settingText}>Video Quality</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="download-outline" size={20} color="#ccc" />
            <Text style={styles.settingText}>Downloads</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingBottom: 80, // Extra padding for bottom tab bar
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#f57c00",
    marginBottom: 10,
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  subscribeButton: {
    backgroundColor: "#f57c00",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  subscribeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subscribeSubtext: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 4,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingText: {
    color: "#ccc",
    fontSize: 14,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});