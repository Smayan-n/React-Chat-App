import { useAuth } from "../contexts/AuthContext";
import "../styles/NavBar.css";

function NavBar() {
	const { currentUser } = useAuth()!;

	return (
		<>
			<section className="navbar">
				<div className="user-name">Logged in as {currentUser?.displayName}</div>
				{/* <div className="settings-icon">
					<MaterialIcon icon="settings" />
				</div> */}
				<div className="dropdown">
					<button className="dropdown-btn">settings</button>
					<div className="dropdown-content">
						<div>content</div>
						<div>content</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default NavBar;
