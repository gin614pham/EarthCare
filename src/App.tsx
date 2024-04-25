import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './navigation/AuthNavigation';
import AppNavigation from './navigation/AppNavigation';
import auth from '@react-native-firebase/auth';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PermissionsAndroid} from 'react-native';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [user, setUser] = useState(auth().currentUser);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        {user ? AppNavigation() : AuthNavigation()}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
