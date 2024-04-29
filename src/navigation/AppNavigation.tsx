import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
const AppStack = createNativeStackNavigator();
import UserContext from '../context/UserContext';
import ActivityScreen from '../screens/ActivityScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import {Alert} from 'react-native';
import AddActivityScreen from '../screens/AddActivityScreen';

//CHUS YS
// 0: guest(chua dang nhap), 1: user, 2: admin,3 volunteer
const stack = [
  {
    name: 'BottomTabs',
    component: BottomTabs,
    options: {headerShown: false},
    allowRoles: [0, 1, 2, 3],
  },
  {
    name: 'Login',
    component: LoginScreen,
    options: {headerShown: false},
    allowRoles: [0],
  },
  {
    name: 'Register',
    component: RegisterScreen,
    options: {headerShown: false},
    allowRoles: [0],
  },
  {
    name: 'EditProfile',
    component: EditProfileScreen,
    options: {headerShown: true},
    allowRoles: [1, 2, 3],
  },
  {
    name: 'ActivityScreen',
    component: ActivityScreen,
    options: {headerShown: true},
    allowRoles: [0, 1, 2, 3],
  },
  {
    name: 'AddLocation',
    component: AddLocationScreen,
    options: {headerShown: true},
    allowRoles: [1, 2, 3],
  },
  {
    name: 'AddActivityScreen',
    component: AddActivityScreen,
    options: {headerShown: true},
    allowRoles: [1, 2, 3],
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
  const [role, setRole] = useState(0);

  useEffect(() => {
    if ((user as {role?: number})?.role !== undefined) {
      setRole((user as {role: number}).role);
    } else {
      setRole(0);
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
