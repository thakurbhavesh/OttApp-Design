// navigation/BottomTab.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Verified import
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';
import TopTabs from './TopTabs';
import ViewDetails from '../screens/Viewdetails'; // Ensure this file exists
import Profile from '../screens/Profile';
import Profilescreen from '../screens/Profilescreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideosScreen from '../screens/VideosScreen';
import Library from '../screens/Library';
import Audio from '../screens/Audio';

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const colors = {
  accent: '#FF9500',
  background: '#000000',
  white: '#FFFFFF',
  textDim: '#666666',
};

function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="ViewDetails" component={ViewDetails} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileScreen" component={Profilescreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Header />
      <TopTabs />
    </View>
  );
}

function VideosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="VideosScreen" component={VideosScreen} options={{ title: 'Videos' }} />
      <Stack.Screen name="ViewDetails" component={ViewDetails} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}

const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9} onPress={onPress}>
      <LinearGradient
        colors={
          focused ? [colors.accent, '#FF9500'] : [colors.background, colors.background]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: 60,
        },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Videos') iconName = 'videocam-outline';
          else if (route.name === 'Audio') iconName = 'musical-notes-outline';
          else if (route.name === 'Library') iconName = 'library-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
      })}
    >
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Videos" component={VideosStack} />
      <BottomTab.Screen name="Audio" component={Audio} />
      <BottomTab.Screen name="Library" component={Library} />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});