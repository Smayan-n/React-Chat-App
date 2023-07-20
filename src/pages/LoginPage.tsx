import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.svg";
import "../styles/login-create-page.css";

function LoginPage() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();
	const signinUser = () => {
		const auth = getAuth();
		signInWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log("user signed in: ", user);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("signin error", error);
			});
	};
	return (
		<>
			<section className="form">
				<h3>Sign In</h3>

				<div className="social">
					<div className="go">
						<img width="30px" height="30px" src={googleIcon} alt="icon" />
					</div>
				</div>

				<div className="or-use-section">or use your email</div>

				<input ref={emailRef} type="email" placeholder="Email" id="email" />
				<input ref={passwordRef} type="password" placeholder="Password" id="password" />
				<button onClick={signinUser}>Log In</button>
				<div className="questions-section">
					Don't have an account? <Link to="/signup">Register</Link> now.
				</div>
			</section>
		</>
	);
}

export default LoginPage;
