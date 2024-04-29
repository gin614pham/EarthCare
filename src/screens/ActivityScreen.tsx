import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const ActivityScreen = () => {
  const activity = {
    name: 'Xử lý rác thải sinh hoạt',
    description:
      'Vấn đề ô nhiễm môi trường do rác thải là một thách thức nghiêm trọng đối với các đô thị hiện nay. Việc xử lý rác thải chưa hiệu quả dẫn đến tình trạng ô nhiễm không chỉ ảnh hưởng đến sức khỏe cộng đồng mà còn làm suy giảm cảnh quan đô thị và thị trường du lịch.',
    address: 'Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    startDateTime: '23/04/2024',
    endDateTime: '25/04/2024',
    hoursStart: '13:30',
    image: 'https://pcd.monre.gov.vn/Data/images/TinTuc/t6/pic_b080_01.jpg',
  };
  return (
    <View style={styles.container}>
      <Image source={{uri: activity.image}} style={styles.image} />
      <Text style={styles.name}>{activity.name}</Text>
      <Text style={styles.time}>
        {activity.startDateTime} - {activity.endDateTime}
      </Text>
      <Text style={styles.time}>Thời gian bắt đầu: {activity.hoursStart}</Text>
      <Text style={styles.addressTitle}>Địa chỉ: </Text>
      <Text style={styles.address}>{activity.address}</Text>
      <Text style={styles.descriptionTitle}>Mô tả</Text>
      <Text style={styles.description}>{activity.description}</Text>
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
});
