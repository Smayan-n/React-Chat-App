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
import { addUserToDatabase } from "../Utility/databaseUtility";
import { AuthObject, AuthProviderProps } from "../Utility/interfaces";

const AuthContext = React.createContext<AuthObject | null>(null);

function useAuth() {
	return useContext(AuthContext);
}

function AuthProvider(props: AuthProviderProps) {
	const { children } = props;
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const navigate = useNavigate();
	function signUp(email: string, password: string) {
		return createUserWithEmailAndPassword(getAuth(), email, password);
	}

	function signInWithGoogle() {
		//sign in with google popup
		const provider = new GoogleAuthProvider();
		const auth = getAuth();
		signInWithPopup(auth, provider)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log("user signed in with google: ", user);
				navigate("/dashboard");

				//add user to firestore database after google sign in
				addUserToDatabase(user);
			})
			.catch((error) => {
				console.log("google signup error", error);
			});
	}

	function login(email: string, password: string) {
		return signInWithEmailAndPassword(getAuth(), email, password);
	}

	function setUsername(name: string) {
		//update username in firebase using auth's current user
		return updateProfile(getAuth().currentUser!, {
			displayName: name,
		});
	}

	function navigateToDashboard() {
		// Return a promise that resolves after the timeout
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				navigate("/dashboard");
				resolve(); // Resolve the promise after the timeout is over
			}, 300);
		});
	}

	//effect to set user state when user logs in or logs out
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
		navigateToDashboard,
		setUsername: setUsername,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, useAuth };
