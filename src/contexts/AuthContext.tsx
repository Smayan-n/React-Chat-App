import {
	GoogleAuthProvider,
	User,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
	updateEmail,
	updateProfile,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUserToDatabase } from "../Utility/databaseUtility";
import { AuthObject, ProviderProps } from "../Utility/interfaces";

const AuthContext = React.createContext<AuthObject | null>(null);

function useAuth() {
	return useContext(AuthContext);
}

function AuthProvider(props: ProviderProps) {
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

	function updateUserProfile(name: string, email?: string) {
		//update username and email in firebase using auth's current user
		if (email) {
			void updateEmail(getAuth().currentUser!, email);
		}
		return updateProfile(getAuth().currentUser!, {
			displayName: name.toLowerCase(),
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
		updateUserProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, useAuth };
