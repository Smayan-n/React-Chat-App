import { User, UserCredential } from "firebase/auth";

interface AuthObject {
	currentUser: User | null;
	signUp: (name: string, email: string, password: string) => Promise<UserCredential>;
	signInWithGoogle: () => void;
	login: (email: string, password: string) => Promise<UserCredential>;
	navigateToDashboard: () => void;
	setUserName: (name: string) => void;
}

interface AuthProviderProps {
	children: React.ReactNode;
}

interface AlertProps {
	message: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
}

interface LoaderProps {
	message: string;
}

export type { AlertProps, AuthObject, AuthProviderProps, LoaderProps };
