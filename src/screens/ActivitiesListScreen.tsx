import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoadingContext from '../context/LoadingContext';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserContext from '../context/UserContext';
import {navigationCustom} from '../navigation/AppNavigation';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';

interface item {
  id: string;
  name: string;
  description: string;
  image: string;
}

const ActivitiesListScreen = ({navigation}: any) => {
  const {setIsLoading} = React.useContext(LoadingContext);
  const [activities, setActivities] = useState<item[]>([]);
  const {user} = React.useContext(UserContext);

  const loadActivities = async () => {
    const activities2 = [
      {
        id: '1',
        name: 'Chiến dịch dọn vệ sinh môi trường tại Núi Everest',
        description:
          'Chiến dịch dọn vệ sinh môi trường tại Núi Everest được tổ chức bởi tổ chức môi trường Blue Sky.',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '2',
        name: 'Chiến dịch trồng cây xanh tại Đà Nẵng',
        description:
          'Chiến dịch trồng cây xanh tại Đà Nẵng được tổ chức bởi tổ chức môi trường VKU.',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '3',
        name: 'Chiến dịch tìm kiếm nguồn nước sạch tại Đà Nẵng',
        description:
          'Chiến dịch tìm kiếm nguồn nước sạch tại Đà Nẵng được tổ chức bởi tổ chức môi trường VKU.',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '4',
        name: 'Chiến dịch dạch môi trường tại Núi eve',
        description: 'Chien dich',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '5',
        name: 'Chiến dịch dạch môi trường tại Núi eve',
        description: 'Chien dich',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '6',
        name: 'Chiến dịch dạch môi trường tại Núi eve',
        description: 'Chien dich',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '7',
        name: 'Chiến dịch dạch môi trường tại Núi eve',
        description: 'Chien dich',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
      {
        id: '8',
        name: 'Chiến dịch dạch môi trường tại Núi eve',
        description: 'Chien dich',
        image:
          'https://www.baokontum.com.vn/uploads/Image/2021/12/23/170154a.JPG',
      },
    ];
    setActivities(activities2);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const renderItem = ({item, index}: {item: item; index: number}) => (
    <Animated.View entering={FadeInDown.duration(1000).delay(index * 150)}>
      <TouchableOpacity
        style={activityStyles.activityItem}
        onPress={() => {
          navigation.navigate('ActivityScreen', {activityId: item.id});
        }}>
        <Image
          source={{uri: item.image}}
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
