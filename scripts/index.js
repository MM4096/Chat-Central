import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
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

function CreateUser() {
	createUserWithEmailAndPassword(auth, $("#email").val(), $("#password").val())
	.then((userCredential) => {
		const user = userCredential.user;
	})
	.catch ((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error("Error: " + errorMessage);
	}) 
}

// because all the functions are scope-leveled, this changes it to window leveled.
window.CreateUser = CreateUser;