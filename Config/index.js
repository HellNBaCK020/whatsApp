// Import the functions you need from the SDKs you need
import  app  from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/database"
import "firebase/compat/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe7oLY0sC7BNEH1eCHhvL8dsf4HfOxN2U",
  authDomain: "whatsapp-9723d.firebaseapp.com",
  databaseURL: "https://whatsapp-9723d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "whatsapp-9723d",
  storageBucket: "whatsapp-9723d.appspot.com",
  messagingSenderId: "409052414336",
  appId: "1:409052414336:web:133bdc87b529ecf48f8165"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;