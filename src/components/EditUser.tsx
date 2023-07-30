import { useRef, useState } from "react";
import { EditUserProps } from "../Utility/interfaces";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/EditUser.css";
import Alert from "./Alert";
import Loader from "./Loader";

function EditUser({ onClose }: EditUserProps) {
	const { currentUser, updateUserProfile } = useAuth()!;
	const { updateUserDatabaseProfile } = useFirestore()!;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		//input validation
		const name = nameRef.current!.value;
		const email = emailRef.current!.value;
		if (name === "" || email === "") {
			setError("Make sure all fields are filled!");
			return;
		}

		setLoading(true);
		updateUserDatabaseProfile(name, email)
			.then(() => {
				updateUserProfile(name, email)
					.then(() => {
						setLoading(false);
						//close popup

						onClose();
						//reload window so name on messages also changes - temp solution
						window.location.reload();
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<section className="edit-user-section">
			{error && <Alert autoClose message={error} onClose={() => setError("")} />}
			<h3 className="edit-user-title">{currentUser!.displayName}'s profile</h3>
			<form onSubmit={handleSubmit} className="edit-user-form">
				{loading && <Loader message="Updating Profile" />}
				<div>
					<label htmlFor="name">Edit username</label>
					<input
						defaultValue={currentUser!.displayName as string}
						ref={nameRef}
						id="name"
						type="text"
						className="edit-user-input"
						placeholder="User name"
					/>
				</div>

				<div>
					<label htmlFor="email">Edit email</label>
					<input
						defaultValue={currentUser!.email as string}
						ref={emailRef}
						id="email"
						type="text"
						className="edit-user-input"
						placeholder="User email"
					/>
				</div>

				<button className="edit-user-btn" type="submit">
					Update Profile
				</button>
			</form>
		</section>
	);
}

export default EditUser;
