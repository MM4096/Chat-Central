import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
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
let user;
let currentChatId = null;
let currentChatData = get(child(dbRef, "/users"));

onAuthStateChanged(auth, (_user) => {
	if (_user) {
		user = _user;
	} else {
		window.location.href = "login.html";
	}
});


$(document).ready(function () {
	get(child(dbRef, "chats/")).then((snapshot) => {
		let currentUid = user.uid;
		snapshot.forEach((childSnapshot) => {
			let key = childSnapshot.key;
			key = key.split(",");
			// see if user is part of the chat
			if (key.indexOf(currentUid) !== -1) {
				let buttonText = "";
				// finding other users in the chat
				for (let i = 0; i < key.length; i++) {
					if (i !== key.indexOf(currentUid)) {
						get(child(dbRef, "users/" + key[i])).then((_snapshot) => {
							console.log(_snapshot.val().username);
							if (buttonText != "") {
								buttonText += ", ";
							}
							buttonText += _snapshot.val().username;
							$("#userList").append('<button onclick="OpenChat(`' + childSnapshot.key + '`)">' + buttonText + '</button>');
						})
					}
				}
			}
		});
	})
		.catch((error) => {
			console.log(error);
		})
});

function LoadChat(chatId) {
	currentChatId = chatId;
	currentChatData = get(child(dbRef, "chats/" + chatId + "/messages/"));
	console.log("reached");
}

window.LoadChat = LoadChat;


currentChatData.on("child_added", (snapshot) => {
	try {
		const messages = snapshot.val();
		console.log(messages);
	}
	catch (error) {
        console.log(error);
    }
});