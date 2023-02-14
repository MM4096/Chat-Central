import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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
const dbRef = ref(db);

onAuthStateChanged(auth, (user) => {
    if (user) {

    } else {
        window.location.href = "login.html";
    }
});

get(child(dbRef, "users/")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});