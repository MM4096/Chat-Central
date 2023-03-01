import {initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import {child, get, getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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
const dbRef = ref(db, "/");
let user;
let currentChatId = null;

onAuthStateChanged(auth, (_user) => {
	if (_user) {
		user = _user;
	} else {
		window.location.href = "login.html";
	}
});


$(document).ready(function () {
	LoadEventHandlers();
});

const LoadEventHandlers = async () => {
	const result = await GetChats();
}

function GetChats() {
	let paths = [];
	let chatIds = [];
	get(child(dbRef, "chats/")).then((snapshot) => {
		let currentUid = user.uid;
		snapshot.forEach((childSnapshot) => {
			let key = childSnapshot.key;
			key = key.split(",");
			// see if user is part of the chat
			if (key.indexOf(currentUid) !== -1) {
				// if user is part of the chat, then get the other user's user id, and add it to the list
				if (key.indexOf(currentUid) === 0) {
					paths.push(key[1]);
					chatIds.push(childSnapshot.key);
				}
				else {
					paths.push(key[0]);
					chatIds.push(childSnapshot.key);
				}
			}
		});
		const promises = [];
		paths.forEach((path) => {
			promises.push(new Promise((resolve) => {
				const reference = ref(db, path);
				get(child(reference, "/username/")).then((snapshot) => {
                    const data = snapshot.val();
					resolve(data);
                });
			}));
		});

		Promise.all(promises).then((results) => {
			results.forEach((result, index) => {
				$("#userList").append('<button class="chatButtons" data-chatId="' + chatIds[index] + '">' + result + '</button>');
			});
			let buttons = $(".chatButtons");
			for (let i = 0; i < buttons.length; i++) {
				$(buttons[i]).on("click", function() {
					const path =$(this).attr("data-chatId");
					const chatRef = ref(db, "chats/" + path + "/messages/");
					// add new event listener
					onValue(chatRef, (snapshot) => {
						snapshot.forEach((msgContainer) => {
							console.log("Message timestamp: " + msgContainer.key);
							console.log("Message: " + msgContainer.child("message").val());
							console.log("User: " + GetUsername(msgContainer.child("from")));
						})

					})
				});
			}
		});

	})
	.catch((error) => {
		console.log(error);
	})
}
function LoadChat(chatId) {
	currentChatId = chatId;
	console.log("reached");
}

function GetUsername(userid) {
	const reference = ref(db, "users/" + userid + "/")
	get(child(reference, "/username/")).then((snapshot) => {
		return snapshot.val();
	});
}

window.LoadChat = LoadChat;