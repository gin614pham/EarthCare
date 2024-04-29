import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import ProfileScreen2 from './ProfileScreen2';
import loginStyles from '../styles/loginStyle';
import LinearGradient from 'react-native-linear-gradient';
import UserContext from '../context/UserContext';
import {SafeAreaView} from 'react-native-safe-area-context';

const ProfileScreen = ({navigation}: any) => {
  const [role, setRole] = React.useState<number>(0);
  const {user} = React.useContext(UserContext);

  useEffect(() => {
    if ((user as {role?: number})?.role !== undefined) {
      setRole((user as {role?: number}).role || 0);
    } else {
      setRole(0);
    }
  }, [user]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
        <View style={loginStyles.container}>
          {role ? (
            <ProfileScreen2 navigation={navigation} />
          ) : (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text> Login </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
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
