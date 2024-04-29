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

const ActivitiesListScreen = ({navigation}: any) => {
  const {setIsLoading} = React.useContext(LoadingContext);
  const [activities, setActivities] = useState([]);
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
    ];
    setActivities(activities2);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {id: string; name: string; description: string; image: string};
  }) => (
    <TouchableOpacity
      style={activityStyles.activityItem}
      onPress={() => {
        navigation.navigate('ActivityScreen', {activityId: item.id});
      }}>
      <Image source={{uri: item.image}} style={activityStyles.activityImage} />
      <View style={activityStyles.activityInfo}>
        <Text style={activityStyles.activityName}>{item.name}</Text>
        <Text style={activityStyles.activityDescription}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
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
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={activityStyles.activityList}
          />
        </View>
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
            navigationCustom(user.role, navigation, 'AddActivityScreen');
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
