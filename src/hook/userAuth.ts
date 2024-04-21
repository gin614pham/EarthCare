import {onAuthStateChanged, User} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import React, {useEffect} from 'react';
import auth from '../api/firebase';
import {initializeAuth} from 'firebase/auth';
import ReactNativeAsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage';

const useUserAuth = () => {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return {user};
};

export default useUserAuth;
function getReactNativePersistence(
  ReactNativeAsyncStorage: AsyncStorageStatic,
):
  | import('@firebase/auth').Persistence
  | import('@firebase/auth').Persistence[]
  | undefined {
  throw new Error('Function not implemented.');
}
