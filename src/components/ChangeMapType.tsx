import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  mapType: string;
  handleChangeMapType: (mapType: string) => void;
}

const ChangeMapType = ({mapType, handleChangeMapType}: Props) => {
  const [visible, setVisible] = useState(false);

  const mapTypOptions = [
    {
      name: 'Mặc định',
      value: 'standard',
      require: require('../assets/images/maptype/standard.png'),
    },
    {
      name: 'Vệ tinh',
      value: 'satellite',
      require: require('../assets/images/maptype/satellite.png'),
    },
    {
      name: 'Địa hình',
      value: 'terrain',
      require: require('../assets/images/maptype/terrain.png'),
    },
  ];

  const linkimage = (option: any) => {
    const imagePath = `../assets/images/maptype/${option.value}.png`;
    return imagePath;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <View style={styles.button}>
          <Icon name="map" size={20} color="black" />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn kiểu bản đồ</Text>
            <View style={styles.buttonContainer}>
              {mapTypOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.mapTypeButton,
                    // mapType === option.value && styles.selectedMapType,
                  ]}
                  onPress={() => {
                    handleChangeMapType(option.value);
                    setVisible(false);
                  }}>
                  <View
                    style={[
                      {
                        padding: 3,
                      },
                      mapType === option.value && {
                        borderWidth: 2,
                        borderColor: 'blue',
                        borderRadius: 5,
                      },
                    ]}>
                    <Image
                      source={option.require}
                      style={{width: 50, height: 50, borderRadius: 5}}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={styles.mapTypeButtonText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    right: 30,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: '10%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapTypeButton: {
    backgroundColor: 'white',

    alignItems: 'center',
  },
  mapTypeButtonText: {
    fontSize: 16,
    color: 'black',
  },
  selectedMapType: {
    borderWidth: 2,
    borderColor: 'blue',
  },
});

export default ChangeMapType;
