import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './navigation/AuthNavigation';
import AppNavigation from './navigation/AppNavigation';
import auth from '@react-native-firebase/auth';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PermissionsAndroid} from 'react-native';
import {StatusBar} from 'react-native';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [user, setUser] = useState(auth().currentUser);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const theme = {
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };
  return (
    <GestureHandlerRootView style={{flex: 1}} {...{theme}}>
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={false}
        />
        {user ? AppNavigation() : AuthNavigation()}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
