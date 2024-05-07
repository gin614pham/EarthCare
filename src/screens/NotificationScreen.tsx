// import React, {useEffect, useState} from 'react';
// import {FlatList, StyleSheet, Text, View} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import UserContext from '../context/UserContext';
// import firestore from '@react-native-firebase/firestore';

// function NotificationScreen() {
//   const [notifications, setNotifications] = useState([]);
//   const {user} = React.useContext(UserContext);

//   useEffect(() => {
//     let subscriber;

//     subscriber = firestore()
//       .collection('notifications')
//       .where('user_id', 'in', ['all', user.uid])
//       .onSnapshot(querySnapshot => {
//         const notifications = [];
//         querySnapshot.forEach(documentSnapshot => {
//           notifications.push({
//             ...documentSnapshot.data(),
//             key: documentSnapshot.id,
//           });
//         });
//         setNotifications(notifications);
//       });

//     // Clean up
//     return () => {
//       if (subscriber) {
//         subscriber();
//       }
//     };
//   }, [user]);

//   const renderItem = ({item}) => (
//     <View style={styles.item}>
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.body}>{item.body}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={notifications}
//         renderItem={renderItem}
//         keyExtractor={item => item.key}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   item: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 8,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   body: {
//     fontSize: 16,
//     marginTop: 5,
//   },
// });

// export default NotificationScreen;

import React, {useState} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoadingContext from '../context/LoadingContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserContext from '../context/UserContext';
import {navigationCustom} from '../navigation/AppNavigation';
import Animated, {FadeInDown} from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import {Activity} from '../types';
import {useFocusEffect} from '@react-navigation/native';

const NotificationScreen = ({navigation}: any) => {
  const {setIsLoading} = React.useContext(LoadingContext);
  const [notifications, setNotifications] = useState([]);
  const {user} = React.useContext(UserContext);

  const loadNotifications = async () => {
    let notifications = [];
    const querySnapshot = await firestore()
      .collection('notifications')
      .where('user_id', 'in', ['all', user?.uid])
      .get();
    querySnapshot.forEach(documentSnapshot => {
      notifications.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    });
    setNotifications(notifications);
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadNotifications();
      setIsLoading(false);
    }, []),
  );

  const renderItem = ({item, index}: {item: Activity; index: number}) => (
    <Animated.View entering={FadeInDown.duration(1000).delay(index * 150)}>
      <TouchableOpacity style={activityStyles.activityItem}>
        <Image
          source={require('../assets/images/avt-default.png')}
          style={activityStyles.activityImage}
        />
        <View style={activityStyles.activityInfo}>
          <Text style={activityStyles.activityName}>{item.title}</Text>
          <Text style={activityStyles.activityDescription}>{item.body}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        colors={['#FDFBFB', '#B4E0F9']}
        style={activityStyles.background_container}>
        <View style={activityStyles.container}>
          <Text style={activityStyles.header}>
            Notifications ({notifications.length})
          </Text>
          <Animated.FlatList
            data={notifications}
            renderItem={({item, index}) => renderItem({item, index})}
            keyExtractor={item => item.key}
            contentContainerStyle={activityStyles.activityList}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const activityStyles = StyleSheet.create({
  background_container: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  activityList: {
    paddingVertical: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  activityImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDescription: {
    fontSize: 16,
  },
});
