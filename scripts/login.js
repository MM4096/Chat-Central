import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
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

function Login() {
    // login system
    let email = $("#email").val();
    let password = $("#password").val();
    setPersistence(auth, browserLocalPersistence).then(() => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            console.log("Logged in!");
            window.location.href='index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            let errorDisplay;
            switch (errorCode) {
                case "auth/invalid-email":
                    errorDisplay = "Error: Invalid email";
                break;
                case "auth/user-not-found":
                    errorDisplay = "Error: No account with that email";
                break;
                case "auth/wrong-password":
                    errorDisplay = "Error: Incorrect password";
                break;
                default:
                    errorDisplay = "An unknown error occured. Check the console for more details";
                    console.error(errorMessage);
                break;
            }
            $("#error").text(errorDisplay);
        });
    })
    .catch((error) => {
        console.error("Error: " + error.message);
    });
    
}

window.Login = Login;