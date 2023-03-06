import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { child, get, getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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
let selfUsername = "";
let chatOtherUsername = "";
let chatRef = "";

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
		get(child(dbRef, "users/" + currentUid)).then((snapshot) => {
			selfUsername = snapshot.val().username;
		});
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
			console.log(path);
			promises.push(new Promise((resolve) => {
				const reference = ref(db, "users/" + path);
				get(reference).then((snapshot) => {
                    const data = snapshot.val().username;
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
					chatRef = "chats/" + path + "/messages/";
					chatOtherUsername = $(this).text();
					// add new event listener
					onValue(ref(db, chatRef), (snapshot) => {
						let messageBox = $(".messageBox");
						messageBox.empty();
						snapshot.forEach((msgContainer) => {
							console.log("Message timestamp: " + msgContainer.key);
							console.log("Message: " + msgContainer.val().message);
							let sentUser = msgContainer.val().from;
							if (sentUser === user.uid) {
								sentUser = selfUsername;
							}
							else {
								sentUser = chatOtherUsername;
							}
							console.log("Sender: " + sentUser);
							messageBox.prepend('<div class="message"><p>' + sentUser + ': ' + msgContainer.val().message + '</p></div>');
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

function Send() {
	console.log("reached");
	const timeSent = Date.now();
	console.log(timeSent)
	const message = $("#message").val();
	$("#message").val("");
	if (chatRef !== "") {
		set(ref(db, chatRef + "/" + timeSent), {
			from: user.uid,
			message: message,
		})
	}
}

window.Send = Send;