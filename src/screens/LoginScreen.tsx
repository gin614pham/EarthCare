import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import auth from '@react-native-firebase/auth';

interface LoginFormType {
  email: string;
  password: string;
}

const LoginScreen = ({navigation}: any) => {
  const [loginForm, setLoginForm] = useState<LoginFormType>({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const userCredentials = await auth().signInWithEmailAndPassword(
        loginForm.email,
        loginForm.password,
      );
      Alert.alert('Thành công', 'Đăng nhập thành công');
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại' + '\n' + error);
    }
  };
  const handleChange = (name: string, value: string) => {
    setLoginForm({...loginForm, [name]: value});
  };
  return (
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
            onPress={() => navigation.navigate('Register', {name: 'Register'})}>
            Register here
          </Text>{' '}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
