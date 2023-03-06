import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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

function Login(email, password) {
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
}

function CreateUser() {
    const email = $("#email").val();
    const username = $("#username").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();
    if (username === "") {
        $("#error").text("Error: No username was entered");
    }
    else if (password !== confirmPassword) {
        $("#error").text("Error: Your passwords don't match");
    }
    else {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            $("#error").text("");
            set(ref(db, "users/" + user.uid), {
                username: username,
                email: email,
            })
            Login(email, password);
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
                    console.log(errorMessage);
                break;
            }
            $("#error").text("Error: " + error.message);
        }) 
    }
}

// because all the functions are scope-leveled, this changes it to window leveled.
window.CreateUser = CreateUser;