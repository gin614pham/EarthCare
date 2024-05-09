import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './navigation/AppNavigation';
import auth from '@react-native-firebase/auth';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Platform, StatusBar} from 'react-native';
import LoadingScreen from './screens/other/LoadingScreen';
import LoadingContext from './context/LoadingContext';
import UserContext from './context/UserContext';
import firestore from '@react-native-firebase/firestore';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import notifee, {
//   AndroidImportance,
//   AndroidVisibility,
// } from '@notifee/react-native'; // Import thư viện notifee
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen';

function App(): JSX.Element {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

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
    // BackgroundFetch.configure(
    //   {
    //     minimumFetchInterval: 1, // Thời gian tối thiểu giữa mỗi lần chạy (phút)
    //     enableHeadless: true, // Cho phép chạy khi ứng dụng không chạy
    //     startOnBoot: true, // Bắt đầu chạy khi thiết bị khởi động
    //   },
    //   async () => {
    //     console.log('[BackgroundFetch] Task completed');

    //     // Kiểm tra hoạt động mới và hiển thị thông báo
    //     await checkForNewActivitiesAndNotify();

    //     // Kết thúc nhiệm vụ
    //     BackgroundFetch.finish();
    //   },
    //   error => {
    //     console.error('[BackgroundFetch] Error', error);
    //   },
    // );

    // // Bắt đầu chạy BackgroundFetch
    // BackgroundFetch.start();
  }, []);

  // // Hàm hiển thị thông báo

  // async function onDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'important',
  //     name: 'Important Notifications',
  //     importance: AndroidImportance.HIGH,
  //     lights: true,
  //     vibration: true,
  //     visibility: AndroidVisibility.PUBLIC,
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }

  // Hàm kiểm tra hoạt động mới và hiển thị thông báo
  // const checkForNewActivitiesAndNotify = async () => {
  //   // hiển thị thông báo giả
  //   await onDisplayNotification();
  // };

  //config push notification message remote firebase
  useEffect(() => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
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
  // config message notification remote firebase and chạy ngầm

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     const channelId = await notifee.createChannel({
  //       id: 'important',
  //       name: 'Important Notifications',
  //       importance: AndroidImportance.HIGH,
  //       lights: true,
  //       vibration: true,
  //       visibility: AndroidVisibility.PUBLIC,
  //     });

  //     await notifee.displayNotification({
  //       title: remoteMessage.notification?.title,
  //       body: remoteMessage.notification?.body,
  //       android: {
  //         channelId,
  //         smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'
  //         pressAction: {
  //           id: 'default',
  //         },
  //       },
  //     });
  //   });

  //   return unsubscribe;
  // }, []);

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
