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

	const navigate = useNavigate();

	//go back to login page is user is not signed in
	useEffect(() => {
		if (!currentUser) navigate("/login");
	}, [currentUser, navigate]);

	useEffect(() => {
		//when group is edited, set current group to updated one from database - so it is properly rendered in chatInterface
		if (currentGroup) {
			chatGroups.forEach((group: AppGroup) => {
				if (group.groupId === currentGroup.groupId) {
					setCurrentGroup(group);
				}
			});
		}
	}, [chatGroups, currentGroup]);

	function handleLogOut() {
		const auth = getAuth();
		auth.signOut()
			.then(() => {
				console.log(currentUser, "User signed out");
				navigate("/login");
			})
			.catch((error) => {
				console.log(error, "error signing out");
			});
	}

	async function handleSendMessage(message: string) {
		await addMessageToDatabase(currentGroup!.groupId, message, currentUser!.uid);
	}

	function handleGroupSet(groupOn: AppGroup) {
		setLoading(true);
		setCurrentGroup(groupOn);
		listenToMsgsFrom(groupOn.groupId)
			.then(() => {
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<>
			<NavBar onLogOut={handleLogOut} />

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
