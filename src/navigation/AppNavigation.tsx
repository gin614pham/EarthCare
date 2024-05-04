import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserContext from '../context/UserContext';
import ActivityScreen from '../screens/ActivityScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import {Alert} from 'react-native';
import AddActivityScreen from '../screens/AddActivityScreen';
import ImageDetailScreen from '../screens/other/ImageDetailScreen';
import {ROLE} from '../types';

const AppStack = createNativeStackNavigator();

//CHUS YS
// 0: guest(chua dang nhap), 1: user, 2: admin,3 volunteer
const stack = [
  {
    name: 'BottomTabs',
    component: BottomTabs,
    options: {headerShown: false},
    allowRoles: [ROLE.GUEST, ROLE.USER, ROLE.ADMIN, ROLE.VOLUNTEER],
  },
  {
    name: 'Login',
    component: LoginScreen,
    options: {headerShown: false},
    allowRoles: [ROLE.GUEST],
  },
  {
    name: 'Register',
    component: RegisterScreen,
    options: {headerShown: false},
    allowRoles: [ROLE.GUEST],
  },
  {
    name: 'EditProfile',
    component: EditProfileScreen,
    options: {headerShown: true},
    allowRoles: [ROLE.USER, ROLE.ADMIN, ROLE.VOLUNTEER],
  },
  {
    name: 'ActivityScreen',
    component: ActivityScreen,
    options: {headerShown: true},
    allowRoles: [ROLE.GUEST, ROLE.USER, ROLE.ADMIN, ROLE.VOLUNTEER],
  },
  {
    name: 'AddLocation',
    component: AddLocationScreen,
    options: {headerShown: true},
    allowRoles: [ROLE.USER, ROLE.ADMIN, ROLE.VOLUNTEER],
  },
  {
    name: 'AddActivityScreen',
    component: AddActivityScreen,
    options: {headerShown: true},
    allowRoles: [ROLE.USER, ROLE.ADMIN, ROLE.VOLUNTEER],
  },
  {
    name: 'ImageDetailScreen',
    component: ImageDetailScreen,
    options: {
      headerShown: true,
      headerTransparent: true,
      title: '',
      headerTintColor: 'white',
    },
    allowRoles: [ROLE.GUEST, ROLE.USER, ROLE.ADMIN, ROLE.VOLUNTEER],
  },
];
const navigationCustom = (role: number, navigation: any, page: string) => {
  if (!role) {
    Alert.alert(
      'Permission Denied',
      'You must login to access this page',
      [
        {
          text: 'Close',
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => navigation.navigate('Login'),
        },
      ],
      {cancelable: false},
    );
  } else {
    if (stack.find(item => item.name === page)?.allowRoles.includes(role)) {
      navigation.navigate(page);
    } else {
      Alert.alert(
        'Permission Denied',
        'You do not have permission to access this page',
      );
    }
  }
};

const AppNavigation = () => {
  const {user} = React.useContext(UserContext);
  const [role, setRole] = useState(ROLE.GUEST);

  useEffect(() => {
    if ((user as {role?: number})?.role !== undefined) {
      setRole((user as {role: number}).role);
    } else {
      setRole(ROLE.GUEST);
    }
  }, [user]);

  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      {stack.map((item, index) => {
        if (item.allowRoles.includes(role)) {
          return (
            <AppStack.Screen
              key={index}
              name={item.name}
              component={item.component}
              options={item.options}
            />
          );
        }
      })}
    </AppStack.Navigator>
  );
};

export default AppNavigation;
export {navigationCustom};
