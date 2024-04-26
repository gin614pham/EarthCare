import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import ProfileScreen2 from './ProfileScreen2';
import loginStyles from '../styles/loginStyle';
import LinearGradient from 'react-native-linear-gradient';
import UserContext from '../context/UserContext';

const ProfileScreen = ({navigation}: any) => {
  const [role, setRole] = React.useState(0);
  const {user} = React.useContext(UserContext);

  useEffect(() => {
    if (user?.role && user?.role !== undefined) {
      setRole(user?.role);
    } else {
      setRole(0);
    }
  }, [user]);

  useEffect(() => {
    console.log('usssser', user);
  }, []);
  return (
    <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
      <View style={loginStyles.container}>
        {role ? (
          <ProfileScreen2 navigation={navigation} />
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text> Login </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
