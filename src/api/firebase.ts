// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBuRZUDfzbxnbf-oo_RfweUUXjcwv1zM3g',
  authDomain: 'earthcare-aoisora.firebaseapp.com',
  projectId: 'earthcare-aoisora',
  storageBucket: 'earthcare-aoisora.appspot.com',
  messagingSenderId: '1066737501791',
  appId: '1:1066737501791:web:5a24945dd575e290b37dea',
  measurementId: 'G-CXY4TW8S97',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
