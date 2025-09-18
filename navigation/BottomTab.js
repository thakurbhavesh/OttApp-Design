import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import TopTabs from './TopTabs';
import ViewDetails from '../screens/ViewDetails';
import Profile from '../screens/Profile';
import Profilescreen from '../screens/Profilescreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideosScreen from '../screens/VideosScreen';
import Library from '../screens/Library';
import Audio from '../screens/Audio';
import SearchScreen from '../screens/SearchScreen';

const BottomTab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const VideosStack = createNativeStackNavigator();
const AudioStack = createNativeStackNavigator();
const LibraryStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

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

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
    </SearchStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const navigation = useNavigation();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Profilescreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.white,
          headerTitle: 'Profile Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.white,
          headerTitle: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
    </ProfileStack.Navigator>
  );
}

const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={
          focused
            ? [colors.accent, '#FF9500']
            : [colors.background, colors.background]
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

function MainTabsNavigator() {
  const navigation = useNavigation();
  const [lastTab, setLastTab] = useState('Home');

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const currentState = navigation.getState();
      if (currentState && currentState.routes) {
        const currentRoute = currentState.routes[currentState.index];
        if (currentRoute && !['Profile', 'ProfileScreen', 'Settings'].includes(currentRoute.name)) {
          setLastTab(currentRoute.name);
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

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
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Videos') iconName = focused ? 'videocam' : 'videocam-outline';
          else if (route.name === 'Audio') iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          else if (route.name === 'Library') iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarButton: (props) => <CustomTabBarButton {...props} routeName={route.name} />,
      })}
    >
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Videos" component={VideosStackNavigator} />
      <BottomTab.Screen name="Audio" component={AudioStackNavigator} />
      <BottomTab.Screen name="Library" component={LibraryStackNavigator} />
      <BottomTab.Screen name="Search" component={SearchStackNavigator} />
      <BottomTab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            const currentState = navigation.getState();
            const currentRoute = currentState.routes[currentState.index];

            if (['Profile', 'ProfileScreen', 'Settings'].includes(currentRoute.name)) {
              navigation.navigate(lastTab);
            } else {
              setLastTab(currentRoute.name);
              navigation.navigate('Profile');
            }
          },
        })}
      />
    </BottomTab.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
      <RootStack.Screen
        name="ViewDetails"
        component={ViewDetails}
        options={{ presentation: 'modal' }}
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