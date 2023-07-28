import { FirebaseError } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addUserToDatabase } from "../Utility/databaseUtility";
import { replaceAll } from "../Utility/utilityFunctions";
import googleIcon from "../assets/google.svg";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login-create-page.css";
import Alert from "./Alert";
import Loader from "./Loader";

function SignupPage() {
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const { signUp, signInWithGoogle, navigateToDashboard, updateUserProfile, currentUser } = useAuth()!;

	const navigate = useNavigate();
	useEffect(() => {
		if (currentUser) navigate("/dashboard");
	}, [currentUser, navigate]);

	const createUser = async () => {
		const [name, email, password, confirmPassword] = [
			nameRef.current!.value,
			emailRef.current!.value,
			passwordRef.current!.value,
			confirmPasswordRef.current!.value,
		];
		//input field validation
		if (name === "" || email === "" || password === "") {
			setError("Please fill all fields");
		} else if (password !== confirmPassword) {
			setError("passwords do not match");
		} else {
			//try catch is same as doing .then().error()
			try {
				//reset error
				setError("");
				setLoading(true);

				const userCredential = await signUp(email, password);
				//set username
				await updateUserProfile(name);
				//after navigating to dash, all user fields should be set
				await navigateToDashboard();

				//add user to firestore
				addUserToDatabase(userCredential.user);

				setLoading(false);
			} catch (error) {
				setLoading(false);

				//format error code and display with error state and component
				const errorCode = (error as FirebaseError).code;
				setError(replaceAll(errorCode.substring(5), "-", " "));
			}
		}
	};

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		void createUser();
	}

	return (
		<>
			{error && <Alert onClose={() => setError("")} message={error} />}
			<div className="background">
				<div className="shape"></div>
				<div className="shape"></div>
			</div>
			<form onSubmit={handleSubmit} className="form">
				<h3>Create Account</h3>

				<div className="social">
					<div onClick={signInWithGoogle}>
						<img width="30px" height="30px" src={googleIcon} alt="icon" />
					</div>
				</div>

				<div className="or-use-section">or register with email</div>

				<input className="signup-input" ref={nameRef} type="text" placeholder="Username" id="name" />
				<input className="signup-input" ref={emailRef} type="email" placeholder="Email" id="email" />
				<input className="signup-input" ref={passwordRef} type="password" placeholder="Password" />
				<input
					className="signup-input"
					ref={confirmPasswordRef}
					type="password"
					placeholder="Confirm Password"
				/>

				<button className="submit-btn" type="submit">
					Sign Up
				</button>
				{loading && <Loader message="Creating Account..." />}

				<div className="questions-section">
					Already have an account? <Link to="/login">Sign In</Link> now.
				</div>
			</form>
		</>
	);
}

export default SignupPage;
