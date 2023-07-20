import { useRef } from "react";
import { Link } from "react-router-dom";
import googleIcon from "../assets/google.svg";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login-create-page.css";

function LoginPage() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const { login, signInWithGoogle } = useAuth()!;
	const loginUser = () => {
		login(emailRef.current!.value, passwordRef.current!.value);
	};

	return (
		<>
			<section className="form">
				<h3>Sign In</h3>

				<div className="social">
					<div onClick={signInWithGoogle}>
						<img width="30px" height="30px" src={googleIcon} alt="icon" />
					</div>
				</div>

				<div className="or-use-section">or use your email</div>

				<input ref={emailRef} type="email" placeholder="Email" id="email" />
				<input ref={passwordRef} type="password" placeholder="Password" id="password" />
				<button onClick={loginUser}>Log In</button>
				<div className="questions-section">
					Don't have an account? <Link to="/signup">Register</Link> now.
				</div>
			</section>
		</>
	);
}

export default LoginPage;
