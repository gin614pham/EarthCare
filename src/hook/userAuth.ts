import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

const useUserAuth = () => {
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    setUser(auth().currentUser);
    if (auth().currentUser) {
      const unsubscribe = auth().onAuthStateChanged(user => {
        setUser(user);
      });
      return unsubscribe;
    }
  }, []);

  return {user};
};

export default useUserAuth;
