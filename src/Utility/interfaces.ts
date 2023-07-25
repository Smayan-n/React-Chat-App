import { User, UserCredential } from "firebase/auth";

interface AuthObject {
	currentUser: User | null;
	signUp: (email: string, password: string) => Promise<UserCredential>;
	signInWithGoogle: () => void;
	login: (email: string, password: string) => Promise<UserCredential>;
	navigateToDashboard: () => Promise<void>;
	setUsername: (name: string) => Promise<void>;
}

interface FirestoreObject {
	addUserToDatabase: (user: User) => void;
	findUsersWithName: (name: string) => Promise<AppUser[]>;
}

interface AuthProviderProps {
	children: React.ReactNode;
}
interface FirestoreProviderProps {
	children: React.ReactNode;
}

interface AlertProps {
	message: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
}

interface LoaderProps {
	message: string;
}

//types for documents retrieved from the database
interface AppUser {
	username: string;
	email: string;
	uid: string;
	groups: string[];
}

interface AppMessage {
	messageContent: string;
	sender: string;
	timestamp: Date;
}

export type {
	AlertProps,
	AppMessage,
	AppUser,
	AuthObject,
	AuthProviderProps,
	FirestoreObject,
	FirestoreProviderProps,
	LoaderProps,
};
