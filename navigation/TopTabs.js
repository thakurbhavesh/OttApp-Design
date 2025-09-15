import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LinearGradient from "react-native-linear-gradient"; // For gradient background
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"; // For animations
import { StyleSheet, View, Dimensions } from "react-native";
import MainHome from "../screens/MainHome";
import Originals from "../screens/Originals";
import Movies from "../screens/Movies";
import Shows from "../screens/Shows";
import Audiot from "../screens/Audiot";
import Games from "../screens/Games";
import ComingSoon from "../screens/ComingSoon";
import Live from "../screens/Live";

const TopTab = createMaterialTopTabNavigator();
const { width } = Dimensions.get("window");

export default function TopTabs() {
  const tabCount = 8; // Number of tabs
  const tabWidth = width / Math.min(tabCount, 5); // Dynamic width, capped for readability
  const indicatorScale = useSharedValue(1);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(indicatorScale.value) }],
  }));

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          elevation: 5,
          zIndex: 1,
          backgroundColor: "transparent",
        },
        tabBarLabelStyle: {
          color: "#FFFFFF",
          fontWeight: "700",
          fontSize: 11, // Smaller font to prevent wrapping
          textTransform: "capitalize",
        },
        tabBarIndicatorStyle: [
          {
            backgroundColor: "#F97316",
            height: 3,
            borderRadius: 2,
            width: tabWidth * 0.6,
            marginLeft: tabWidth * 0.2,
          },
          animatedIndicatorStyle,
        ],
        tabBarScrollEnabled: true,
        tabBarItemStyle: {
          width: tabWidth,
          paddingHorizontal: 5,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["#1a1a1a", "#0a0a0a"]}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
      sceneContainerStyle={{ backgroundColor: "#000000" }}
    >
      <TopTab.Screen
        name="All"
        component={MainHome}
        options={{ tabBarLabel: "All" }}
      />
      <TopTab.Screen
        name="Originals"
        component={Originals}
        options={{ tabBarLabel: "Originals" }}
      />
      <TopTab.Screen
        name="Shows"
        component={Shows}
        options={{ tabBarLabel: "Shows" }}
      />
      <TopTab.Screen
        name="Movies"
        component={Movies}
        options={{ tabBarLabel: "Movies" }}
      />
      <TopTab.Screen
        name="ComingSoon"
        component={ComingSoon}
        options={{ tabBarLabel: "Coming Soon" }} // Shortened to prevent wrapping
      />
      <TopTab.Screen
        name="Audio"
        component={Audiot}
        options={{ tabBarLabel: "Audio" }}
      />
      <TopTab.Screen
        name="Live"
        component={Live}
        options={{ tabBarLabel: "Live" }}
      />
      <TopTab.Screen
        name="Games"
        component={Games}
        options={{ tabBarLabel: "Games" }}
      />
    </TopTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});