import { getAuth } from "firebase/auth";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppGroup } from "../Utility/interfaces";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/Dashboard.css";
import ChatGroups from "./ChatGroups";
import ChatInterface from "./ChatInterface";
import NavBar from "./NavBar";

function Dashboard() {
	const { currentUser } = useAuth()!;
	const { addMessageToDatabase, chatGroups, messages, listenToMsgsFrom } = useFirestore()!;
	const [loading, setLoading] = useState(false);

	const [currentGroup, setCurrentGroup] = useState<AppGroup | null>(null);
	// const [messages, setMessages] = useState<AppMessage[] | null>(null);

	const navigate = useNavigate();

	//go back to login page is user is not signed in
	useEffect(() => {
		if (!currentUser) navigate("/login");
	}, [currentUser, navigate]);

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

	async function handleSendMessage(message: string) {
		await addMessageToDatabase(currentGroup!.groupId, message, currentUser!.uid);
	}

	async function handleGroupSet(groupOn: AppGroup) {
		setLoading(true);
		setCurrentGroup(groupOn);
		await listenToMsgsFrom(groupOn.groupId);
		setLoading(false);
	}

	return (
		<>
			{currentUser && <button onClick={logOut}>Log Out</button>}
			<NavBar />

			<section className="main-chats-section">
				<ChatGroups groups={chatGroups} onGroupSet={handleGroupSet} />

				<ChatInterface
					loading={loading}
					onSendMessage={handleSendMessage}
					group={currentGroup}
					messages={messages}
				/>
			</section>
		</>
	);
}

export default Dashboard;
