import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup } from "firebase/auth";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.svg";
import "../styles/login-create-page.css";

function SignupPage() {
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();
	const createUser = () => {
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log("user signed in: ", user);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("signup error", error);
			});
	};

	const googleSignup = () => {
		const provider = new GoogleAuthProvider();
		const auth = getAuth();
		signInWithPopup(auth, provider)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log("user signed in with google: ", user);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("google signup error", error);
			});
	};

	return (
		<>
			<section className="form">
				<h3>Create Account</h3>

				<div className="social">
					<div onClick={googleSignup}>
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
