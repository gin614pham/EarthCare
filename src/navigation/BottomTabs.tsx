import React, {useContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import ActivityScreen from '../screens/ActivityScreen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.customTabBarButton} onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: '#B4E0F9',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        //shadow,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Map"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon2 name="map" color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="search1" color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings2"
        component={HomeScreen}
        options={{
          tabBarButton: props => (
            <CustomTabBarButton {...props} onPress={() => alert('Hello')} />
          ),
          tabBarIcon: ({focused, color, size}) => (
            <View style={styles.centerButton}>
              <Icon
                name="plus"
                color="#fff"
                size={35}
                style={{transform: [{rotate: '45deg'}]}}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="hearto" color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={35} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customTabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
  centerButton: {
    backgroundColor: 'blue',
    width: 55,
    height: 55,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default BottomTabs;
