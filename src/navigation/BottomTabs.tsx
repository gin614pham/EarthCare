import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ActivitiesListScreen from '../screens/ActivitiesListScreen';
import LinearGradient from 'react-native-linear-gradient';
import {navigationCustom} from './AppNavigation';
import UserContext from '../context/UserContext';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
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

const BottomTabs = ({navigation}: any) => {
  const {user} = React.useContext(UserContext);
  const directionPage = (page: string) => {
    navigationCustom(user?.role, navigation, page);
  };

  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  React.useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#35B6FF',
        tabBarShowLabel: true,
        tabBarLabelStyle: {fontSize: 12, marginBottom: 5, fontWeight: '500'},
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          // bottom: 20,
          // left: 20,
          // right: 20,
          backgroundColor: '#ffffff',

          height: 70,
          // làm cho center button không bị che mất
          paddingVertical: 10,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Map"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            // <Icon2 name="map" color={color} size={35} />
            // <Image
            //   source={require('../assets/images/bottombar/map.png')}
            //   style={{width: 35, height: 35}}
            // />

            <Animated.View style={animatedStyle}>
              <Image
                source={require('../assets/images/bottombar/map.png')}
                style={{width: 35, height: 35}}
              />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            // <Icon name="bells" color={color} size={35} />
            // <Image
            //   source={require('../assets/images/bottombar/notification.png')}
            //   style={{width: 35, height: 35}}
            // />
            <Animated.View style={animatedStyle}>
              <Image
                source={require('../assets/images/bottombar/notification.png')}
                style={{width: 35, height: 35}}
              />
            </Animated.View>
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
            // <LinearGradient
            //   colors={['#B4E0F9', '#35B6FF']}
            //   style={styles.centerButton}>

            <View style={styles.centerButton}>
              {/* <Icon
                  name="plus"
                  color="#fff"
                  size={35}
                  style={{fontWeight: 'bold'}}
                /> */}
              <LottieView
                source={require('../assets/animations/add.json')}
                autoPlay
                loop
                style={{width: 110, height: 110}}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivitiesListScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            // <Icon name="hearto" color={color} size={35} />
            // <Image
            //   source={require('../assets/images/bottombar/volunteer.png')}
            //   style={{width: 35, height: 35}}
            // />
            <Animated.View style={animatedStyle}>
              <Image
                source={require('../assets/images/bottombar/volunteer.png')}
                style={{width: 35, height: 35}}
              />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            // <Icon name="user" color={color} size={35} />
            // <Image
            //   source={require('../assets/images/bottombar/profile.png')}
            //   style={{width: 35, height: 35}}
            // />
            <Animated.View style={animatedStyle}>
              <Image
                source={require('../assets/images/bottombar/profile.png')}
                style={{width: 35, height: 35}}
              />
            </Animated.View>
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
    top: -20,
  },
  centerButton: {
    backgroundColor: 'white',
    width: 90,
    height: 90,
    borderRadius: 50,
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
