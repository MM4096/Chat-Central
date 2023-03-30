import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { child, get, getDatabase, onValue, ref, set, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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
let isInChat = false;
let firstRun = true;

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

$("#message").on("keypress", function (e) {
    if (e.which === 13) {
        $("#chatButton").trigger("click");
    }
});

const LoadEventHandlers = async () => {
	GetChats();
	// gets new requests
	let requestRef = "/requests/";
	onValue(ref(db, requestRef), (snapshot) => {
		if (!isInChat) {
			$(".messageBox").empty();
			snapshot.forEach((child) => {
				if (child.key === selfUsername) {
					let from = child.val().from;
					// only gets relative path
					let path = child.ref.toString().replace("https://chatcentral-89222-default-rtdb.asia-southeast1.firebasedatabase.app/", "");
					$(".messageBox").append("<div class='request'>\n" +
						"                <p>" + from + " wants to be friends with you!</p>\n" +
						"                <button onclick='Accept(\"" + path + "\")'>Accept</button>\n" +
						"                <button onclick='Deny(\"" + path + "\")'>Deny</button>\n" +
						"            </div>")
				}
			});
		}
	});
	let chatRef = "/chats/";
	onChildAdded(ref(db, chatRef), (snapshot) =>{
		if (!firstRun) {
			$(".userList").empty().append("<button onClick=\"FriendPage()\">Friend List</button>");
			GetChats();
		}
	});
}

function GetRequests() {
	get(child(dbRef, "/requests/")).then((snapshot) => {
		console.log(selfUsername);
		snapshot.forEach((child) => {
			if (child.key === selfUsername) {
				let from = child.val().from;
				// only gets relative path
				let path = child.ref.toString().replace("https://chatcentral-89222-default-rtdb.asia-southeast1.firebasedatabase.app/", "");


				$(".messageBox").append("<div class='request'>\n" +
					"                <p>" + from + " wants to be friends with you!</p>\n" +
					"                <button onclick='Accept(\"" + path + "\")'>Accept</button>\n" +
					"                <button onclick='Deny(\"" + path + "\")'>Deny</button>\n" +
					"            </div>")
			}
		})
	})
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
				$("#userList").append('<button class="chatButtons" data-chatId="' + chatIds[index] + '" onclick="OpenChat()">' + result + '</button>');
			});
			let buttons = $(".chatButtons");
			for (let i = 0; i < buttons.length; i++) {
				$(buttons[i]).on("click", function() {
					$(".userList > *").each(function() {
						$(this).removeClass("selectedUser");
						console.log("removed")
					});
					$(this).addClass("selectedUser");
					isInChat = true;
					let chatButton = $("#chatButton");
					$("#message").attr("placeholder", "Enter your message...");
					chatButton.text("Send");
					chatButton.attr("onclick", "Send()");
					const path =$(this).attr("data-chatId");
					chatRef = "chats/" + path + "/messages/";
					chatOtherUsername = $(this).text();
					// add new event listener
					onValue(ref(db, chatRef), (snapshot) => {
						if (chatRef === "chats/" + path + "/messages/") {
							let messageBox = $(".messageBox");
							messageBox.empty();
							snapshot.forEach((msgContainer) => {
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
						}
					});
				});
			}
			if (firstRun) {
				GetRequests();
				firstRun = false;
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

function AddFriend() {
	let userList = $(".chatButtons");
	let friendList = [];
	for (let i = 0; i < userList.length; i++) {
		friendList.push(userList.eq(i).text());
	}
	let friendName = $("#message").val();
	get(child(dbRef, "/users/")).then((snapshot) => {
		let success = false;
		snapshot.forEach((childSnapshot) => {
			const childData = childSnapshot.val();
			if (childData.username === friendName) {
				if (childSnapshot.key === user.uid) {
					window.alert("You can't add yourself as a friend!");
					success = true;
                    $("#message").val("");
				}
				else if (friendList.includes(friendName)) {
					window.alert("You are already friends with " + friendName + "!");
					success = true;
                    $("#message").val("");
				}
				else {
					set(ref(db, "requests/" + friendName), {
						sUid: user.uid,
						from: selfUsername,
					}).then(() => {
						window.alert("Friend request sent!");
                        $("#message").val("");
					});
					success = true;
				}
			}
		});
		if (!success) {
			window.alert("Username: " + friendName + " not found. Check your capitalization and spelling.");
		}
	});
}

function FriendPage() {
	$(".userList > *").each(function() {
		$(this).removeClass("selectedUser");
	});
	$(".friendButton").addClass("selectedUser");
	let chatButton = $("#chatButton");
	chatRef = "";
	$(".messageBox").empty();
	$("#message").attr("placeholder", "Add a friend...");
	chatButton.text("Add Friend");
	chatButton.attr("onclick", "AddFriend()");
	isInChat = false;
	ShowFriends();
}

function Deny(path) {
	let delRef = ref(db, path);
	console.log(delRef);
	remove(delRef).then(() => {
		console.log("Request denied");
	});
}

function Accept(path) {
	let pathRef = ref(db, path);
	get(child(dbRef, path)).then((snapshot) => {
		console.log(snapshot.val());
		set(ref(db, "chats/" + user.uid + "," + snapshot.val().sUid), {
			started: true,
		});
	});
	remove(pathRef).then(() => {
		console.log("Request accepted");
	});
}

window.Send = Send;
window.AddFriend = AddFriend;
window.FriendPage = FriendPage;
window.Accept = Accept;
window.Deny = Deny;