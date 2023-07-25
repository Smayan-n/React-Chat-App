import { User, getAuth } from "firebase/auth";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findUsersWithName, getAppUser } from "../Utility/databaseUtility";
import { AppGroup, AppMessage, AppUser } from "../Utility/interfaces";
import { getTime, sortMessagesByTime } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/Dashboard.css";
import Alert from "./Alert";
import ChatGroup from "./ChatGroup";
import NavBar from "./NavBar";

function Dashboard() {
	const { currentUser } = useAuth()!;
	const { addGroupToDatabase, addMessageToDatabase, chatGroups, messages, getMessagesFromGroup } = useFirestore()!;

	const [users, setUsers] = useState<AppUser[]>([]);
	const [currentGroup, setCurrentGroup] = useState<AppGroup | null>(null);
	// const [messages, setMessages] = useState<AppMessage[] | null>(null);
	const msgInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log(messages);
	}, []);

	const navigate = useNavigate();
	const logOut = () => {
		const auth = getAuth();
		auth.signOut()
			.then(() => {
				console.log(currentUser, "User signed out");
				navigate("/login");
			})
			.catch((error) => {
				console.log(error, "error signing out");
			});
	};

	async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const usersFound = await findUsersWithName(e.target.value);
		setUsers(usersFound);
	}

	async function addUser(user: AppUser) {
		const user1 = (await getAppUser(currentUser!)) as AppUser;
		await addGroupToDatabase(user1, user);
	}

	async function handleSendMessage() {
		const user1 = (await getAppUser(currentUser!)) as AppUser;
		await addMessageToDatabase(currentGroup!.groupId, msgInputRef.current!.value, user1);
	}

	function handleGroupSet(groupOn: AppGroup) {
		setCurrentGroup(groupOn);
		getMessagesFromGroup(groupOn.groupId);

		// const msgs: AppMessage[] = await getMessagesFromGroup(groupOn.groupId);
		// msgs.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
		// console.log(msgs);
		// setMessages(msgs);
	}

	return (
		<>
			<div>Dashboard</div>
			<div>{currentUser ? "User is signed in" : "No User signed in"}</div>
			{currentUser ? (
				<>
					<div>
						User id: {currentUser?.uid} User email: {currentUser?.email}{" "}
					</div>
					<div>username: {currentUser?.displayName}</div>
					<button onClick={logOut}>Log Out</button>
				</>
			) : (
				""
			)}
			<br />
			<br />

			<NavBar />
			<input onChange={handleInputChange}></input>
			<ul>
				{users &&
					users.map((user) => (
						<li key={user.email}>
							{user.username} | {user.email}
							<button
								onClick={() => {
									addUser(user);
								}}
							>
								Add User
							</button>
						</li>
					))}
			</ul>

			<br />
			<div>Message</div>
			<input ref={msgInputRef} type="text" />
			<button onClick={handleSendMessage}>Send</button>
			<ul>
				{chatGroups &&
					chatGroups.map((group: AppGroup) => (
						<ChatGroup key={group.groupId} onGroupSet={handleGroupSet} group={group} />
					))}
			</ul>
			<br />
			<br />
			<div>Current Group: {currentGroup && currentGroup.groupId}</div>
			{messages &&
				sortMessagesByTime(messages).map((msg: AppMessage) => {
					return (
						<div key={msg.messageContent}>
							{msg.messageContent} | sent: {getTime(new Date(msg.timeSent.seconds * 1000))}
						</div>
					);
				})}
		</>
	);
}

export default Dashboard;
