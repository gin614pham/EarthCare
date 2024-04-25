import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BottomTabs from './BottomTabs';

const AppStack = createNativeStackNavigator();
const AppNavigation = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="BottomTabs" component={BottomTabs} />
      <AppStack.Screen name="Home" component={HomeScreen} />
    </AppStack.Navigator>
  );
};

export default AppNavigation;
