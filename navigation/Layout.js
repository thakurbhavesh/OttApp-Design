import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "./Header";
import TopTabs from "./TopTabs";
import BottomTabNavigator from "./BottomTab";

export default function Layout({ children }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Top Tabs */}
      <View style={styles.topTabs}>
        <TopTabs />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Bottom Tabs */}
      <BottomTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topTabs: { height: 50 },   // TopTab ki height fix
  content: { flex: 1 },      // Content flexible rahega
});
