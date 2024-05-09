import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoadingContext from '../context/LoadingContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserContext from '../context/UserContext';
import {navigationCustom} from '../navigation/AppNavigation';
import Animated, {FadeInDown} from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import {Activity} from '../types';
import {useFocusEffect} from '@react-navigation/native';

const ActivitiesListScreen = ({navigation}: any) => {
  const {setIsLoading} = React.useContext(LoadingContext);
  const [activities, setActivities] = useState<Activity[]>([]);
  const {user} = React.useContext(UserContext);

  const parseDate = (date: string) => {
    const parts = date.split(',')[1].split('/');
    return new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]),
    );
  };

  const loadActivities = async () => {
    const atv = await firestore()
      .collection('activities')
      .where('approve', '==', true)
      .get();
    const activities2 = atv.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Activity[];
    const currentDate = new Date();
    activities2.sort((a, b) => {
      const startDayA = parseDate(a.startDateTime);
      const startDayB = parseDate(b.startDateTime);
      const endDayA = parseDate(a.endDateTime);
      const endDayB = parseDate(b.endDateTime);

      const isActivityActiveA =
        startDayA <= currentDate && endDayA >= currentDate;
      const isActivityActiveB =
        startDayB <= currentDate && endDayB >= currentDate;
      const isActivityPastA = endDayA < currentDate;
      const isActivityPastB = endDayB < currentDate;
      const isActivityFutureA = startDayA > currentDate;
      const isActivityFutureB = startDayB > currentDate;
      return isActivityActiveA && !isActivityActiveB
        ? -1
        : isActivityActiveB && !isActivityActiveA
        ? 1
        : isActivityActiveA && isActivityActiveB && endDayA < endDayB
        ? -1
        : isActivityActiveA && isActivityActiveB && endDayA > endDayB
        ? 1
        : isActivityPastA && !isActivityPastB
        ? 1
        : isActivityPastB && !isActivityPastA
        ? -1
        : isActivityPastA && isActivityPastB && endDayA < endDayB
        ? 1
        : isActivityPastA && isActivityPastB && endDayA > endDayB
        ? -1
        : isActivityFutureA && !isActivityFutureB
        ? -1
        : isActivityFutureB && !isActivityFutureA
        ? 1
        : isActivityFutureA && isActivityFutureB && startDayA < startDayB
        ? -1
        : isActivityFutureA && isActivityFutureB && startDayA > startDayB
        ? 1
        : 0;
    });
    setActivities(activities2);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadActivities();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item, index}: {item: Activity; index: number}) => (
    <Animated.View entering={FadeInDown.duration(1000).delay(index * 150)}>
      <TouchableOpacity
        style={activityStyles.activityItem}
        onPress={() => {
          navigation.navigate('ActivityScreen', {activity: item});
        }}>
        <Image
          source={{uri: item.image[0]}}
          style={activityStyles.activityImage}
        />
        <View style={activityStyles.activityInfo}>
          <Text numberOfLines={2} style={activityStyles.activityName}>
            {item.name}
          </Text>
          <Text numberOfLines={3} style={activityStyles.activityDescription}>
            {item.description}
          </Text>
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
          <Text style={activityStyles.header}>Activities</Text>
          <FlatList
            data={activities}
            renderItem={({item, index}) => renderItem({item, index})}
            keyExtractor={item => item.id}
            contentContainerStyle={activityStyles.activityList}
          />
        </View>
        <Animated.View entering={FadeInDown.duration(1000).delay(500)}>
          <TouchableOpacity
            style={{
              backgroundColor: '#35B6FF',
              padding: 10,
              alignItems: 'center',
              borderRadius: 10,
              marginTop: 10,
              marginBottom: '30%',
            }}
            onPress={() => {
              navigationCustom(user?.role, navigation, 'AddActivityScreen');
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Register an activity
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ActivitiesListScreen;

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
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDescription: {
    fontSize: 16,
  },
});
