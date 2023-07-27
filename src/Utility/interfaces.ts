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
	addGroupToDatabase: (groupMembers: AppUser[], groupName: string) => Promise<void>;
	updateGroup: (groupId: string, groupMembers: AppUser[], groupName: string) => Promise<void>;

	listenToMsgsFrom: (groupId: string) => Promise<void>;
	findUsersWithName: (name: string) => Promise<AppUser[]>;
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

interface ChatInterfaceProps {
	group: AppGroup | null;
	messages: AppMessage[];
	onSendMessage: (message: string) => Promise<void>;
	loading: boolean;
}

interface MessageProps {
	message: AppMessage;
	leftorright: string;
}

interface ChatGroupsProps {
	groups: AppGroup[];
	onGroupSet: (group: AppGroup) => void;
}

interface PopupProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

interface CreateGroupChatProps {
	onClose: () => void;
	group?: AppGroup | null;
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
	ChatGroupsProps,
	ChatInterfaceProps,
	CreateGroupChatProps,
	FirestoreObject,
	FirestoreProviderProps,
	LoaderProps,
	MessageProps,
	PopupProps,
};
