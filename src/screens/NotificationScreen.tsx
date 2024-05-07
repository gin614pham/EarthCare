import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserContext from '../context/UserContext';
import firestore from '@react-native-firebase/firestore';

function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const {user} = React.useContext(UserContext);

  useEffect(() => {
    let subscriber;

    subscriber = firestore()
      .collection('notifications')
      .where('user_id', 'in', ['all', user.uid])
      .onSnapshot(querySnapshot => {
        const notifications = [];
        querySnapshot.forEach(documentSnapshot => {
          notifications.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setNotifications(notifications);
      });

    // Clean up
    return () => {
      if (subscriber) {
        subscriber();
      }
    };
  }, [user]);

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default NotificationScreen;
