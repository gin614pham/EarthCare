import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {getCurrentLocation} from '../api/googleMapAPI';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';

const AddActivityScreen = ({navigation}: any) => {
  const [activityInfo, setActivityInfo] = useState({
    name: '',
    address: '',
    startDate: '',
    endDate: '',
    description: '',
    image: [],
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [showPickerDateStart, setShowPickerDateStart] = useState(false);
  const [showPickerDateEnd, setShowPickerDateEnd] = useState(false);
  const [showPickerTime, setShowPickerTime] = useState(false);

  useEffect(() => {
    console.log(activityInfo);
  }, [activityInfo]);

  const handlePressAddImage = () => {
    navigation.navigate('ImagePicker', {
      setActivityInfo: setActivityInfo,
      activityInfo: activityInfo,
    });
  };

  const handleAddActivity = () => {
    console.log(activityInfo);
  };

  const getCurrentPosition = async () => {
    Geolocation.getCurrentPosition(position => {
      setActivityInfo({
        ...activityInfo,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    });
    const currentLocation = await getCurrentLocation(
      activityInfo.latitude,
      activityInfo.longitude,
    );
    setActivityInfo({...activityInfo, address: currentLocation});
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    const dayOfWeek = newDate.getDay();
    const dayOfWeekString = [
      'Chủ Nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];
    return `${dayOfWeekString[dayOfWeek]}, ${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên hoạt động"
          value={activityInfo.name}
          onChangeText={text => setActivityInfo({...activityInfo, name: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={activityInfo.address}
          onChangeText={text =>
            setActivityInfo({...activityInfo, address: text})
          }
        />
        <TouchableOpacity onPress={getCurrentPosition}>
          <Image
            source={require('../assets/icons/location.png')}
            style={styles.locationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        {showPickerDateStart && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerDateStart(false);
              if (selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  startDate: selectedDate,
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Ngày bắt đầu"
          value={
            activityInfo.startDate ? formatDate(activityInfo.startDate) : ''
          }
          onFocus={() => setShowPickerDateStart(true)}
        />
      </View>

      <View style={styles.inputContainer}>
        {showPickerTime && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerTime(false);
              if (selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  startDate: selectedDate,
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Chọn giờ"
          value={
            activityInfo.startDate
              ? `${activityInfo.startDate.getHours()}:${activityInfo.startDate.getMinutes()}`
              : ''
          }
          onFocus={() => setShowPickerTime(true)}
        />
      </View>

      <View style={styles.inputContainer}>
        {showPickerDateEnd && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerDateEnd(false);
              if (selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  endDate: selectedDate,
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Ngày kết thúc"
          value={activityInfo.endDate ? formatDate(activityInfo.endDate) : ''}
          onFocus={() => setShowPickerDateEnd(true)}
        />
      </View>

      <View>
        <TextInput
          style={styles.multilineInput}
          placeholder="Description"
          multiline
          numberOfLines={4}
          value={activityInfo.description}
          onChangeText={text =>
            setActivityInfo({...activityInfo, description: text})
          }
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddActivity}>
        <Text style={styles.buttonText}>Add Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
  },
  locationIcon: {
    width: 30,
    height: 30,
  },
  multilineInput: {
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddActivityScreen;
