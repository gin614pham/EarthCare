import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useUserAuth from './hook/userAuth';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const {user} = useUserAuth();
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
