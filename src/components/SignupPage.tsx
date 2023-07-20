import { useRef } from "react";
import { Link } from "react-router-dom";
import googleIcon from "../assets/google.svg";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login-create-page.css";

function SignupPage() {
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const { signUp, signInWithGoogle } = useAuth()!;

	const createUser = () => {
		signUp(nameRef.current!.value, emailRef.current!.value, passwordRef.current!.value);
	};

	return (
		<>
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
				<input ref={passwordRef} type="password" placeholder="Password" id="password" />

				<button onClick={createUser}>Sign Up</button>

				<div className="questions-section">
					Already have an account? <Link to="/login">Sign In</Link> now.
				</div>
			</section>
		</>
	);
}

export default SignupPage;
