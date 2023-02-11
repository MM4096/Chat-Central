import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyCgebjp9UWGlH-gMBp0MVYJ8thoXqglt-Q",
    authDomain: "chatcentral-89222.firebaseapp.com",
    databaseURL: "https://chatcentral-89222-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatcentral-89222",
    storageBucket: "chatcentral-89222.appspot.com",
    messagingSenderId: "1019016139576",
    appId: "1:1019016139576:web:0a0717c37921a1389da7cd"
  };

initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
  } else {
    console.log("User is signed out");
  }
});