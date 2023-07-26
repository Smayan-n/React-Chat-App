import { getAuth } from "firebase/auth";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findUsersWithName, getAppUser } from "../Utility/databaseUtility";
import { AppGroup, AppUser } from "../Utility/interfaces";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/Dashboard.css";
import ChatGroup from "./ChatGroup";
import ChatInterface from "./ChatInterface";
import NavBar from "./NavBar";

function Dashboard() {
	const { currentUser } = useAuth()!;
	const { addGroupToDatabase, addMessageToDatabase, chatGroups, messages, listenToMsgsFrom } = useFirestore()!;

	const [users, setUsers] = useState<AppUser[]>([]);
	const [currentGroup, setCurrentGroup] = useState<AppGroup | null>(null);
	// const [messages, setMessages] = useState<AppMessage[] | null>(null);

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
		const user1 = (await getAppUser(currentUser!.uid)) as AppUser;
		await addGroupToDatabase(user1, user);
	}

	async function handleSendMessage(message: string) {
		await addMessageToDatabase(currentGroup!.groupId, message, currentUser!.uid);
	}

	function handleGroupSet(groupOn: AppGroup) {
		setCurrentGroup(groupOn);
		listenToMsgsFrom(groupOn.groupId);
	}

	return (
		<>
			<NavBar />
			{/* {currentUser && <button onClick={logOut}>Log Out</button>}
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
			</ul> */}

			<section className="main-chats-section">
				<div className="chat-groups">
					{chatGroups &&
						chatGroups.map((group: AppGroup) => {
							return <ChatGroup key={group.groupId} onGroupSet={handleGroupSet} group={group} />;
						})}
				</div>

				<ChatInterface onSendMessage={handleSendMessage} group={currentGroup} messages={messages} />
			</section>
		</>
	);
}

export default Dashboard;
