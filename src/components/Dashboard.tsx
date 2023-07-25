import { User, getAuth } from "firebase/auth";

import { onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/Dashboard.css";
import NavBar from "./NavBar";
function Dashboard() {
	const { currentUser } = useAuth()!;
	const { findUsersWithName, addGroupToDatabase, addMessageToDatabase, getAppUser } = useFirestore()!;
	const [users, setUsers] = useState([]);

	const msgInputRef = useRef<HTMLInputElement>(null);

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

	async function addUser(user: User) {
		const user1 = await getAppUser(currentUser!);
		addGroupToDatabase(user1, user);
	}

	function handleSendMessage() {
		addMessageToDatabase("zCkqr48ja7YuQqcgNT0L", msgInputRef.current!.value, currentUser!);
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
		</>
	);
}

export default Dashboard;
