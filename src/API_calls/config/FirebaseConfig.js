import * as firebase from 'firebase'
var config = {
  apiKey: "AIzaSyDcap44frZZhNGFjoUk8gqT8GqRkhzaTP4",
  authDomain: "navigus-a35e5.firebaseapp.com",
  databaseURL: "https://navigus-a35e5.firebaseio.com",
  projectId: "navigus-a35e5",
  storageBucket: "navigus-a35e5.appspot.com",
  messagingSenderId: "233675747357",
  appId: "1:233675747357:web:650cac78054845320396f4",
  measurementId: "G-8JVSFNW1MF",
};
const FirebaseConfig= firebase.initializeApp(config);
export default FirebaseConfig;