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
    const email = $("#email").val();
    const username = $("#username").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();
    if (username == "") {
        $("#error").text("Error: No username was entered");
    }
    else if (password != confirmPassword) {
        $("#error").text("Error: Your passwords don't match");
    }
    else {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            $("#error").text("");
        })
        .catch ((error) => {
            const errorCode = error.code;
            let errorMessage;
            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "Email was invalid";
                break;
                case "auth/weak-password":
                    errorMessage = "Password must be at least 6 characters long";
                break;
                case "auth/email-already-in-use":
                    errorMessage = "Email is already in use";
                break;
                default:
                    errorMessage = "An unknown error occured"
                break;
            }
            $("#error").text("Error: " + errorMessage);
        }) 
    }
}

// because all the functions are scope-leveled, this changes it to window leveled.
window.CreateUser = CreateUser;