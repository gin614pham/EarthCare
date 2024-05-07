import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import auth from '@react-native-firebase/auth';
import LoadingContext from '../context/LoadingContext';
import firestore from '@react-native-firebase/firestore';
import UserContext from '../context/UserContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

interface LoginFormType {
  email: string;
  password: string;
}

const LoginScreen = ({navigation}: any) => {
  const [loginForm, setLoginForm] = useState<LoginFormType>({
    email: '',
    password: '',
  });
  const {setIsLoading} = React.useContext(LoadingContext);
  const {user, setUser} = React.useContext(UserContext);

  const handleLogin = async () => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);
      const userCredentials = await auth().signInWithEmailAndPassword(
        loginForm.email,
        loginForm.password,
      );
      const userData = await firestore()
        .collection('users')
        .doc(userCredentials.user.uid)
        .get();
      const token = await messaging().getToken();
      const userToken = await firestore()
        .collection('user-tokens')
        .doc(userCredentials.user.uid)
        .get();
      if (!userToken.exists) {
        await firestore()
          .collection('user-tokens')
          .doc(userCredentials.user.uid)
          .set({
            token: token,
          });
      } else {
        await firestore()
          .collection('user-tokens')
          .doc(userCredentials.user.uid)
          .update({
            token: token,
          });
      }

      setUser({
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
        role: userData.data()?.role,
        avatar: userData.data()?.avatar,
        name: userData.data()?.name,
      });
      navigation.navigate('Map');

      Alert.alert('Thành công', 'Đăng nhập thành công');
      // lặp qua từng user và thêm ngày tạo , ngày update
    } catch (error) {
      Alert.alert('Lỗi', error.message.replace(/\[.*?\]/, '').trim());
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (name: string, value: string) => {
    setLoginForm({...loginForm, [name]: value});
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <LinearGradient
        colors={['#FDFBFB', '#B4E0F9']}
        style={loginStyles.background_container}>
        <View style={loginStyles.container}>
          <Text style={loginStyles.header}>Login</Text>
          <View style={loginStyles.input_container}>
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              value={loginForm.email}
              onChangeText={text => handleChange('email', text)}
            />
            <TextInput
              secureTextEntry
              style={loginStyles.input}
              placeholder="Password"
              value={loginForm.password}
              onChangeText={text => handleChange('password', text)}
            />
            <View style={loginStyles.link}>
              <Text style={loginStyles.linkText}>Forgot Password?</Text>
            </View>
          </View>
          <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
            <Text style={loginStyles.button_text}>Login</Text>
          </TouchableOpacity>
          <Text style={loginStyles.text}>
            Don't have an account?{' '}
            <Text
              style={loginStyles.linkText}
              onPress={() =>
                navigation.navigate('Register', {name: 'Register'})
              }>
              Register here
            </Text>{' '}
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;
