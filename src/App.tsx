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
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BackgroundFetch from 'react-native-background-fetch'; // Import thư viện BackgroundFetch

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

    // Đăng ký BackgroundFetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Thời gian tối thiểu giữa mỗi lần chạy (phút)
        enableHeadless: true, // Cho phép chạy khi ứng dụng không chạy
        startOnBoot: true, // Bắt đầu chạy khi thiết bị khởi động
      },
      async () => {
        console.log('[BackgroundFetch] Task completed');

        // Kiểm tra hoạt động mới và hiển thị thông báo
        await checkForNewActivitiesAndNotify();

        // Kết thúc nhiệm vụ
        BackgroundFetch.finish();
      },
      error => {
        console.error('[BackgroundFetch] Error', error);
      },
    );

    // Bắt đầu chạy BackgroundFetch
    BackgroundFetch.start();
  }, []);

  // Hàm kiểm tra hoạt động mới và hiển thị thông báo
  const checkForNewActivitiesAndNotify = async () => {
    // Logic kiểm tra hoạt động mới ở đây
    // Nếu có hoạt động mới, hiển thị thông báo
  };

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
            <SafeAreaProvider>
              <NavigationContainer>
                <AppNavigation />
                {loading && <LoadingScreen />}
              </NavigationContainer>
            </SafeAreaProvider>
          </UserContext.Provider>
        </LoadingContext.Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
