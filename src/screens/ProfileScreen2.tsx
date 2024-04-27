import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import UserContext from '../context/UserContext';

interface ProfileInfoType {
  name: string;
  email: string;
  avatar: string;
}

const ProfileScreen2 = ({navigation}: any) => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>({
    name: '',
    email: '',
    avatar: '',
  });
  const {setUser} = React.useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await firestore()
          .collection('users')
          .doc(auth().currentUser?.uid)
          .get();
        if (userData.exists) {
          const {name, email, avatar} = userData.data() as ProfileInfoType;
          setProfileInfo({name, email, avatar});
        }
      };

      fetchData();
    }, []),
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
      <View style={loginStyles.container}>
        <View style={loginStyles.input_container}>
          {profileInfo.avatar === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 100, width: 100, borderRadius: 50}} />
            </SkeletonPlaceholder>
          ) : (
            <Image
              source={
                profileInfo.avatar == 'none'
                  ? require('../assets/images/avt-default.png')
                  : {uri: profileInfo.avatar}
              }
              style={loginStyles.avatar}
            />
          )}
          {profileInfo.name === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 20, width: 200, borderRadius: 4}} />
            </SkeletonPlaceholder>
          ) : (
            <Text style={loginStyles.text}>{profileInfo.name}</Text>
          )}
          {profileInfo.email === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 20, width: 200, borderRadius: 4}} />
            </SkeletonPlaceholder>
          ) : (
            <Text style={loginStyles.text}>{profileInfo.email}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleEditProfile}
          style={loginStyles.edit_button}>
          <Icon name="edit" size={10} color="black" />
          <Text style={loginStyles.text}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={loginStyles.button}
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  auth()
                    .signOut()
                    .then(() => {
                      setUser(null);
                    });
                },
              },
            ]);
          }}>
          <Text style={loginStyles.button_text}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen2;
