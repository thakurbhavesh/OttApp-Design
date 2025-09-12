// navigation/BottomTab.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';
import TopTabs from './TopTabs';
import ViewDetails from '../screens/ViewDetails';
import Profile from '../screens/Profile';
import Profilescreen from '../screens/Profilescreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideosScreen from '../screens/VideosScreen';
import Library from '../screens/Library';
import Audio from '../screens/Audio';

const BottomTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator(); // Root for shared screens like ViewDetails
const HomeStack = createNativeStackNavigator(); // Distinct for Home
const VideosStack = createNativeStackNavigator(); // Distinct for Videos
const AudioStack = createNativeStackNavigator(); // Distinct for Audio
const LibraryStack = createNativeStackNavigator(); // Distinct for Library

const colors = {
  accent: '#FF9500',
  background: '#000000',
  white: '#FFFFFF',
  textDim: '#666666',
};

function HomeScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeTabs" component={HomeTabs} />
      <HomeStack.Screen name="Profile" component={Profile} />
      <HomeStack.Screen name="ProfileScreen" component={Profilescreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
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

function VideosStackNavigator() {
  return (
    <VideosStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <VideosStack.Screen name="VideosScreen" component={VideosScreen} options={{ title: 'Videos' }} />
    </VideosStack.Navigator>
  );
}

function AudioStackNavigator() {
  return (
    <AudioStack.Navigator screenOptions={{ headerShown: false }}>
      <AudioStack.Screen name="Audio" component={Audio} />
    </AudioStack.Navigator>
  );
}

function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="Library" component={Library} />
    </LibraryStack.Navigator>
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

// Standalone component for the bottom tabs (valid React component)
function MainTabsNavigator() {
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
      <BottomTab.Screen name="Videos" component={VideosStackNavigator} />
      <BottomTab.Screen name="Audio" component={AudioStackNavigator} />
      <BottomTab.Screen name="Library" component={LibraryStackNavigator} />
    </BottomTab.Navigator>
  );
}

// Root navigator using the standalone MainTabsNavigator component
export default function BottomTabNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
      <RootStack.Screen 
        name="ViewDetails" 
        component={ViewDetails} 
        options={{ presentation: 'modal' }} // Optional: Modal for details
      />
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});