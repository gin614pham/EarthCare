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
import firestore from '@react-native-firebase/firestore';
import LoadingContext from '../context/LoadingContext';
import UserContext from '../context/UserContext';
import {SafeAreaView} from 'react-native-safe-area-context';

interface RegisterFormType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = ({navigation}: any) => {
  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const {setIsLoading} = React.useContext(LoadingContext);
  const {user, setUser} = React.useContext(UserContext);

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert('Error', 'Password and Confirm Password must be the same');
      return;
    }
    try {
      setIsLoading(true);
      const userCredentials = await auth()
        .createUserWithEmailAndPassword(
          registerForm.email,
          registerForm.password,
        )
        .then(user => {
          firestore().collection('users').doc(user.user.uid).set({
            name: registerForm.name,
            email: registerForm.email,
            role: 1,
            avatar: 'none',
          });
        });

      setUser({
        uid: '',
        email: registerForm.email,
        role: 1,
        avatar: 'none',
        name: registerForm.name,
      });
      Alert.alert('Success', 'Register success');
      navigation.navigate('Map');
    } catch (error) {
      Alert.alert('Error', error.message.replace(/\[.*?\]/, ''));
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (name: string, value: string) => {
    setRegisterForm({...registerForm, [name]: value});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
        <View style={loginStyles.container}>
          <Text style={loginStyles.header}>Register</Text>
          <View style={loginStyles.input_container}>
            <TextInput
              style={loginStyles.input}
              placeholder="Name"
              value={registerForm.name}
              onChangeText={text => handleChange('name', text)}
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              value={registerForm.email}
              onChangeText={text => handleChange('email', text)}
            />
            <TextInput
              secureTextEntry
              style={loginStyles.input}
              placeholder="Password"
              value={registerForm.password}
              onChangeText={text => handleChange('password', text)}
            />
            <TextInput
              secureTextEntry
              style={loginStyles.input}
              placeholder="Confirm Password"
              value={registerForm.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
            />
          </View>
          <TouchableOpacity style={loginStyles.button} onPress={handleRegister}>
            <Text style={loginStyles.button_text}>Register</Text>
          </TouchableOpacity>
          <Text style={loginStyles.text}>
            Already have an account?{' '}
            <Text
              style={loginStyles.linkText}
              onPress={() => navigation.navigate('Login', {name: 'Login'})}>
              Login here
            </Text>{' '}
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RegisterScreen;
