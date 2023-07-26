import { FirebaseError } from "firebase/app";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { replaceAll } from "../Utility/utilityFunctions";
import googleIcon from "../assets/google.svg";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login-create-page.css";
import Alert from "./Alert";
import Loader from "./Loader";

function LoginPage() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const { login, signInWithGoogle, navigateToDashboard } = useAuth()!;
	const loginUser = async () => {
		const [email, password] = [emailRef.current!.value, passwordRef.current!.value];
		//input field validation
		if (email === "" || password === "") {
			setError("Please fill all fields");
		} else {
			try {
				setError("");
				setLoading(true);

				await login(email, password);
				await navigateToDashboard();

				setLoading(false);
			} catch (error) {
				setLoading(false);

				const errorCode: string = (error as FirebaseError).code;
				setError(replaceAll(errorCode.substring(5), "-", " "));
			}
		}
	};

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		void loginUser();
	}

	return (
		<>
			{error && <Alert setError={setError} message={error}></Alert>}
			<div className="background">
				<div className="shape"></div>
				<div className="shape"></div>
			</div>

			<form onSubmit={handleSubmit} className="form">
				<h3>Sign In</h3>

				<div className="social">
					<div onClick={signInWithGoogle}>
						<img width="30px" height="30px" src={googleIcon} alt="icon" />
					</div>
				</div>

				<div className="or-use-section">or login with your email</div>

				<input className="signup-input" ref={emailRef} type="email" placeholder="Email" id="email" />
				<input
					className="signup-input"
					ref={passwordRef}
					type="password"
					placeholder="Password"
					id="password"
				/>
				<button type="submit" className="submit-btn">
					Log In
				</button>
				{loading && <Loader message="Signing In..." />}

				<div className="questions-section">
					Don't have an account? <Link to="/signup">Register</Link> now.
				</div>
			</form>
		</>
	);
}

export default LoginPage;
