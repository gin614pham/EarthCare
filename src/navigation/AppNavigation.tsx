import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
const AppStack = createNativeStackNavigator();
import UserContext from '../context/UserContext';
import ActivityScreen from '../screens/ActivityScreen';

const AppNavigation = () => {
  const {user} = React.useContext(UserContext);
  const [role, setRole] = useState(0);

  useEffect(() => {
    if (user?.role && user?.role !== undefined) {
      setRole(user?.role);
    } else {
      setRole(0);
    }
  }, [user]);
  // 0: guest, 1: user, 2: admin,3 volunteer
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
      options: {headerShown: false},
      allowRoles: [1, 2, 3],
    },
    {
      name: 'ActivityScreen',
      component: ActivityScreen,
      options: {headerShown: true},
      allowRoles: [0, 1, 2, 3],
    },
  ];
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
