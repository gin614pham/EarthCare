import React, {useState, useEffect} from 'react';
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

interface item {
  id: string;
  name: string;
  description: string;
  image: string;
}

const ActivitiesListScreen = ({navigation}: any) => {
  const {setIsLoading} = React.useContext(LoadingContext);
  const [activities, setActivities] = useState<Activity[]>([]);
  const {user} = React.useContext(UserContext);

  const loadActivities = async () => {
    const atv = await firestore().collection('activities').get();
    const activities2 = atv.docs.map(doc => doc.data()) as Activity[];
    const currentDate = new Date();
    activities2.sort((a, b) => {
      const startDayA = new Date(a.startDateTime);
      const startDayB = new Date(b.startDateTime);
      const endDayA = new Date(a.endDateTime);
      const endDayB = new Date(b.endDateTime);

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
        : isActivityActiveA && isActivityActiveB
        ? 0
        : isActivityPastA && !isActivityPastB
        ? 1
        : isActivityPastB && !isActivityPastA
        ? -1
        : isActivityPastA && isActivityPastB
        ? 0
        : isActivityFutureA && !isActivityFutureB
        ? -1
        : isActivityFutureB && !isActivityFutureA
        ? 1
        : isActivityFutureA && isActivityFutureB
        ? 0
        : 0;
    });
    setActivities(activities2);
  };

  // useEffect(() => {
  //   loadActivities();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadActivities();
      setIsLoading(false);
    }, []),
  );

  const renderItem = ({item, index}: {item: Activity; index: number}) => (
    <Animated.View entering={FadeInDown.duration(1000).delay(index * 150)}>
      <TouchableOpacity
        style={activityStyles.activityItem}
        onPress={() => {
          navigation.navigate('ActivityScreen', {activityId: item.id});
        }}>
        <Image
          source={{uri: item.image[0]}}
          style={activityStyles.activityImage}
        />
        <View style={activityStyles.activityInfo}>
          <Text style={activityStyles.activityName}>{item.name}</Text>
          <Text style={activityStyles.activityDescription}>
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
          <Animated.FlatList
            data={activities}
            renderItem={({item, index}) => renderItem({item, index})}
            keyExtractor={item => item.id}
            contentContainerStyle={activityStyles.activityList}
          />
        </View>
        <Animated.View entering={FadeInDown.duration(1000).delay(500)}>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
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
              Đăng ký hoạt động
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
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDescription: {
    fontSize: 16,
  },
});
