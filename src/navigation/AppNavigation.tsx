import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BottomTabs from './BottomTabs';
import ShowBottomSheetContext from '../context/ShowBottomSheetContext';

const AppStack = createNativeStackNavigator();
const AppNavigation = () => {
  const [bottomSheetStatus, setBottomSheetStatus] = React.useState(false);
  const changeBottomSheetStatus = () =>
    setBottomSheetStatus(!bottomSheetStatus);
  return (
    <ShowBottomSheetContext.Provider
      value={{bottomSheetStatus, changeBottomSheetStatus}}>
      <AppStack.Navigator screenOptions={{headerShown: false}}>
        <AppStack.Screen name="BottomTabs" component={BottomTabs} />
        <AppStack.Screen name="Home" component={HomeScreen} />
      </AppStack.Navigator>
    </ShowBottomSheetContext.Provider>
  );
};

export default AppNavigation;
