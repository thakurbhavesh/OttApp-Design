import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MainHome from "../screens/MainHome";
import Originals from "../screens/Originals";
import Movies from "../screens/Movies";
import Shows from "../screens/Shows";
import Audiot from "../screens/Audiot";
import Games from "../screens/Games";

const TopTab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          elevation: 0,
          zIndex: 0,
          backgroundColor: "#000000",
        },
        tabBarLabelStyle: {
          color: "#FFFFFF",
          fontWeight: "600",
          fontSize: 13,
          textTransform: "none",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#F97316",
          height: 2,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 85 },
      }}
    >
      <TopTab.Screen name="All" component={MainHome} />
      <TopTab.Screen name="Originals" component={Originals} />
      <TopTab.Screen name="Movies" component={Movies} />
      <TopTab.Screen name="Shows" component={Shows} />
      <TopTab.Screen name="Audio" component={Audiot} />
      <TopTab.Screen name="Games" component={Games} />
    </TopTab.Navigator>
  );
}