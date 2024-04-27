import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import ActivitiesListScreen from '../screens/ActivitiesListScreen';
import LinearGradient from 'react-native-linear-gradient';
import {navigationCustom} from './AppNavigation';
import UserContext from '../context/UserContext';

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

const BottomTabs = ({navigation}: any) => {
  const {user} = React.useContext(UserContext);
  const directionPage = (page: string) => {
    navigationCustom(user?.role, navigation, page);
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#35B6FF',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          borderRadius: 10,
          height: 80,
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
            <CustomTabBarButton
              {...props}
              onPress={() => directionPage('AddLocation')}
            />
          ),
          tabBarIcon: ({focused, color, size}) => (
            <LinearGradient
              colors={['#B4E0F9', '#35B6FF']}
              style={styles.centerButton}>
              <View>
                <Icon
                  name="plus"
                  color="#fff"
                  size={35}
                  style={{fontWeight: 'bold'}}
                />
              </View>
            </LinearGradient>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivitiesListScreen}
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
