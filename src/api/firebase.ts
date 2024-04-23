import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB8d3Yx1HXgjnn-wwsC0T3vFfj3V2ow0oU',
  authDomain: 'earthcare-b24df.firebaseapp.com',
  projectId: 'earthcare-b24df',
  storageBucket: 'earthcare-b24df.appspot.com',
  messagingSenderId: '751239954697',
  appId: '1:751239954697:web:11276db4752982301853d8',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
