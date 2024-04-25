import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ProfileInfoType {
  name: string;
  email: string;
  avatar: string;
}

const ProfileScreen = ({navigation}: any) => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>({
    name: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userData = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userData.exists) {
          const {name, email, avatar} = userData.data();
          setProfileInfo({name, email, avatar});
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
      <View style={loginStyles.container}>
        <View style={loginStyles.input_container}>
          <Image
            source={
              profileInfo.avatar
                ? {uri: profileInfo.avatar}
                : require('../assets/avt-default.png')
            }
            style={loginStyles.avatar}
          />
          <Text style={loginStyles.header}>{profileInfo.name}</Text>
          <Text style={loginStyles.text}>{profileInfo.email}</Text>
        </View>
        <TouchableOpacity onPress={handleEditProfile}>
          <Icon name="edit" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={loginStyles.button} onPress={() => {}}>
          <Text style={loginStyles.button_text}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;
