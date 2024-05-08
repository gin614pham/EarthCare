import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import UserContext from '../context/UserContext';

const ActivityScreen = ({route}: any) => {
  const {activity} = route.params;
  const {user} = useContext(UserContext);
  const [interested, setInterested] = useState<boolean>(false);
  const [activityEnded, setActivityEnded] = useState<boolean>(false);

  useEffect(() => {
    checkInterest();
    checkActivityEnded();
  }, []);

  const checkInterest = async () => {
    const interestedRef = await firestore()
      .collection('interested_activities')
      .where('userId', '==', user.uid)
      .where('activityId', '==', activity.id)
      .get();

    if (!interestedRef.empty) {
      setInterested(true);
    }
  };

  const checkActivityEnded = () => {
    const currentDate = new Date();
    const activityEndDate = new Date(activity.endDateTime);
    if (currentDate > activityEndDate) {
      setActivityEnded(true);
    }
  };

  const handleInterestToggle = async () => {
    try {
      if (interested) {
        await firestore()
          .collection('interested_activities')
          .where('userId', '==', user.uid)
          .where('activityId', '==', activity.id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
            });
          });
      } else {
        await firestore().collection('interested_activities').add({
          userId: user.uid,
          activityId: activity.id,
        });
      }
      setInterested(!interested);
    } catch (error) {
      console.error('Error toggling interest: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{uri: activity.image[0]}} style={styles.image} />
        <Text style={styles.name}>{activity.name}</Text>
        <Text style={styles.time}>
          {activity.startDateTime} - {activity.endDateTime}
        </Text>
        <Text style={styles.time}>
          Thời gian bắt đầu: {activity.hoursStart}
        </Text>
        <Text style={styles.addressTitle}>Địa chỉ:</Text>
        <Text style={styles.address}>{activity.address}</Text>
        <Text style={styles.descriptionTitle}>Mô tả</Text>
        <Text style={styles.description}>{activity.description}</Text>
        {!activityEnded ? (
          <TouchableOpacity
            style={styles.interestedButton}
            onPress={handleInterestToggle}
            disabled={activityEnded}>
            <Text style={styles.interestedText}>
              {interested ? 'Hủy quan tâm' : 'Quan tâm'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.activityEndedText}>Đã kết thúc</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'center',
    color: 'black',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  address: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  addressTitle: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  descriptionTitle: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  interestedButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  interestedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activityEndedText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    alignSelf: 'center',
  },
});
