import { User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();

		auth.onAuthStateChanged((user) => {
			if (user) {
				console.log("user is signed in");
				setUser(user);
			} else {
				console.log("user is signed out");
				setUser(null);
			}
		});
	}, []);

	const navigate = useNavigate();
	const logOut = () => {
		const auth = getAuth();
		auth.signOut()
			.then(() => {
				console.log(user, "user signed out");
				navigate("/login");
			})
			.catch((error) => {
				console.log(error, "error signing out");
			});
	};

	return (
		<>
			<div>Dashboard</div>
			<div>{user ? "user is signed in" : "No user signed in"}</div>
			{user ? (
				<>
					<div>
						user id: {user?.uid} user email: {user?.email}{" "}
					</div>
					<button onClick={logOut}>Log Out</button>
				</>
			) : (
				""
			)}
		</>
	);
}

export default Dashboard;
