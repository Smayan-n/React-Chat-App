import { FirebaseError } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

	const { signUp, signInWithGoogle, navigateToDashboard, setUserName } = useAuth()!;

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
			try {
				setError("");

				setLoading(true);
				await signUp(name, email, password);
				setUserName(name);
				navigateToDashboard();

				setLoading(false);
			} catch (error) {
				setLoading(false);

				//format error code and display with error state and component
				const errorCode = (error as FirebaseError).code;
				setError(replaceAll(errorCode.substring(5), "-", " "));
			}
		}
	};

	useEffect(() => {
		console.log("useEffect");
	}, []);

	return (
		<>
			{error && <Alert setError={setError} message={error} />}
			<section className="form">
				<h3>Create Account</h3>

				<div className="social">
					<div onClick={signInWithGoogle}>
						<img width="30px" height="30px" src={googleIcon} alt="icon" />
					</div>
				</div>

				<div className="or-use-section">or register with email</div>

				<input ref={nameRef} type="text" placeholder="Name" id="name" />
				<input ref={emailRef} type="email" placeholder="Email" id="email" />
				<input ref={passwordRef} type="password" placeholder="Password" />
				<input ref={confirmPasswordRef} type="password" placeholder="Confirm Password" />

				<button
					className="submit-btn"
					onClick={() => {
						void createUser();
					}}
				>
					Sign Up
				</button>
				{loading && <Loader message="Creating Account..." />}

				<div className="questions-section">
					Already have an account? <Link to="/login">Sign In</Link> now.
				</div>
			</section>
		</>
	);
}

export default SignupPage;
