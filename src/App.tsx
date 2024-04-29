import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './navigation/AppNavigation';
import auth from '@react-native-firebase/auth';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import LoadingScreen from './screens/other/LoadingScreen';
import LoadingContext from './context/LoadingContext';
import UserContext from './context/UserContext';
import firestore from '@react-native-firebase/firestore';
import {PaperProvider} from 'react-native-paper';

function App(): JSX.Element {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userAuth = auth().currentUser;
      if (userAuth) {
        try {
          const userData = await firestore()
            .collection('users')
            .doc(userAuth.uid)
            .get();
          if (userData.exists) {
            setUser({
              uid: userAuth.uid,
              email: userAuth.email,
              role: userData.data()?.role,
              avatar: userData.data()?.avatar,
              name: userData.data()?.name,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const theme = {
    dark: false,
    colors: {
      primary: 'rgb(0, 122, 255)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(0, 122, 255)',
    },
  };

  return (
    <GestureHandlerRootView>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <PaperProvider>
        <LoadingContext.Provider
          value={{isLoading: loading, setIsLoading: setLoading}}>
          <UserContext.Provider value={{user: user, setUser: setUser}}>
            <NavigationContainer>
              <AppNavigation />
              {loading && <LoadingScreen />}
            </NavigationContainer>
          </UserContext.Provider>
        </LoadingContext.Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
