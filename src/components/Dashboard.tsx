import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
	const { currentUser } = useAuth()!;

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
		</>
	);
}

export default Dashboard;
