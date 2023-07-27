import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../contexts/AuthContext";
import "../styles/NavBar.css";

function NavBar(props) {
	const { onLogOut } = props;
	const { currentUser } = useAuth()!;

	return (
		<>
			<section className="navbar">
				<div className="user-name">Hello, {currentUser?.displayName}</div>
				<div className="user-control">
					<div className="profile-icon">
						<CgProfile size="25px" />
					</div>
					<div onClick={onLogOut} className="logout-btn">
						<BiLogOut size="27px" color="red" />
					</div>
				</div>
			</section>
		</>
	);
}

export default NavBar;
