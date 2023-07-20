import { User } from "firebase/auth";

interface AuthObject {
	currentUser: User | null;
	signUp: (name: string, email: string, password: string) => void;
	signInWithGoogle: () => void;
	login: (email: string, password: string) => void;
}

interface AuthProviderProps {
	children: React.ReactNode;
}

export type { AuthObject, AuthProviderProps };
