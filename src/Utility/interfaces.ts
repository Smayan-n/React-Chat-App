import { User, UserCredential } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

interface AuthObject {
	currentUser: User | null;
	signUp: (email: string, password: string) => Promise<UserCredential>;
	signInWithGoogle: () => void;
	login: (email: string, password: string) => Promise<UserCredential>;
	navigateToDashboard: () => Promise<void>;
	setUsername: (name: string) => Promise<void>;
}

interface FirestoreObject {
	chatGroups: AppGroup[];
	messages: AppMessage[];
	addMessageToDatabase: (groupId: string, message: string, uid: string) => Promise<void>;
	addGroupToDatabase: (user1: AppUser, user2: AppUser) => Promise<void>;
	listenToMsgsFrom: (groupId: string) => void;
}
//Props
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

interface ChatGroupProps {
	group: AppGroup;
	onGroupSet: (group: AppGroup) => void;
}

interface ChatInterfaceProps {
	group: AppGroup | null;
	messages: AppMessage[];
	onSendMessage: (message: string) => Promise<void>;
}

interface MessageProps {
	message: AppMessage;
	leftorright: string;
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
	sender: string; //user id
	timeSent: Timestamp;
}

interface AppGroup {
	groupName: string;
	members: string[]; //user ids
	groupId: string;
	createdBy: string; //user id
	createdAt: Timestamp;
}

export type {
	AlertProps,
	AppGroup,
	AppMessage,
	AppUser,
	AuthObject,
	AuthProviderProps,
	ChatGroupProps,
	ChatInterfaceProps,
	FirestoreObject,
	FirestoreProviderProps,
	LoaderProps,
	MessageProps,
};
