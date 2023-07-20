import {
	GoogleAuthProvider,
	User,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthObject, AuthProviderProps } from "../Utility/interfaces";

const AuthContext = React.createContext<AuthObject | null>(null);

function useAuth() {
	return useContext(AuthContext);
}

function AuthProvider(props: AuthProviderProps) {
	const { children } = props;
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const navigate = useNavigate();
	function signUp(name: string, email: string, password: string) {
		createUserWithEmailAndPassword(getAuth(), email, password)
			.then((userCredential) => {
				const currentUser = userCredential.user;

				//set user name
				void updateProfile(currentUser, {
					displayName: name,
				})
					.then(() => {
						console.log("user display name set");
					})
					.catch((error) => {
						console.log("error in setting user display name", error);
					});

				console.log("user signed in: ", currentUser);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("signUp error", error);
			});
	}

	function signInWithGoogle() {
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
	}

	//login functions
	function login(email: string, password: string) {
		signInWithEmailAndPassword(getAuth(), email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log("user signed in: ", user);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("signin error", error);
			});
	}

	useEffect(() => {
		const unsubscribe = getAuth().onAuthStateChanged((user) => {
			setCurrentUser(user);
		});

		//cleanup
		return () => unsubscribe();
	}, []);

	//stores information about current user
	const value: AuthObject = {
		currentUser,
		signUp,
		signInWithGoogle,
		login,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, useAuth };