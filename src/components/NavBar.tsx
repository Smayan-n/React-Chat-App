import { getAuth } from "firebase/auth";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/NavBar.css";
import EditUser from "./EditUser";
import Popup from "./Popup";
import Tooltip from "./Tooltip";

function NavBar() {
	const { currentUser } = useAuth()!;

	const [popupOpen, setPopupOpen] = useState(false);

	const navigate = useNavigate();
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

	return (
		<>
			<section className="navbar">
				<div className="user-name">Hello, {currentUser?.displayName}</div>
				<div className="user-control">
					<div onClick={() => setPopupOpen(true)} className="profile-icon">
						<CgProfile size="25px" />
						<Tooltip position="tip-bottom">Edit Profile</Tooltip>
						<Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
							<EditUser onClose={() => setPopupOpen(false)} />
						</Popup>
					</div>
					<div onClick={handleLogOut} className="logout-btn">
						<BiLogOut size="27px" color="red" />
						<Tooltip position="tip-bottom">Logout</Tooltip>
					</div>
				</div>
			</section>
		</>
	);
}

export default NavBar;
