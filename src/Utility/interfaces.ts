import { User, UserCredential } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

interface AuthObject {
	currentUser: User | null;
	signUp: (email: string, password: string) => Promise<UserCredential>;
	signInWithGoogle: () => void;
	login: (email: string, password: string) => Promise<UserCredential>;
	navigateToDashboard: () => Promise<void>;
	updateUserProfile: (name: string, email?: string) => Promise<void>;
}

interface FirestoreObject {
	chatGroups: AppGroup[];
	messages: AppMessage[];
	userCache: Map<string, AppUser>;
	addMessageToDatabase: (groupId: string, message: string, uid: string) => Promise<void>;
	addGroupToDatabase: (groupMembers: AppUser[], groupName: string) => Promise<void>;
	updateGroup: (groupId: string, groupMembers: AppUser[], groupName: string) => Promise<void>;
	updateUserDatabaseProfile: (name: string, email?: string) => Promise<void>;
	deleteGroup: (groupId: string) => void;
	deleteMessage: (groupId: string, messageId: string) => void;
	updateMessage: (groupId: string, messageId: string, newMessage: string) => void;

	listenToMsgsFrom: (groupId: string) => Promise<void>;
	findUsersWithName: (name: string) => Promise<AppUser[]>;
}

interface RealtimeObject {
	setUserTyping: (groupId: string, userId: string, isTyping?: boolean) => void;
	listenToTypingFrom: (groupId: string) => void;
	groupUsersTyping: Map<string, boolean>;
}
//Props
interface ProviderProps {
	children: React.ReactNode;
}

interface AlertProps {
	message: string;
	type?: string;
	autoClose?: boolean;
	onClose: () => void;
}

interface LoaderProps {
	message: string;
}

interface ChatInterfaceProps {
	group: AppGroup | null;
	loading: boolean;
	// chatInterfaceRef: React.RefObject<HTMLElement>;
}

interface MessageProps {
	message: AppMessage;
	group: AppGroup;
}

interface EditUserProps {
	onClose: () => void;
}
interface TooltipProps {
	children: React.ReactNode;
	position?: string; //top or bottom
}

interface ChatGroupsProps {
	groups: AppGroup[];
	onGroupSet: (group: AppGroup) => void;
	currentGroup: AppGroup | null;
}

interface PopupProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

interface CreateGroupChatProps {
	onClose?: () => void;
	group?: AppGroup | null;
	info?: boolean;
}

//types for documents retrieved from the database
interface AppUser {
	username: string;
	email: string;
	uid: string;
}

interface AppMessage {
	messageContent: string;
	sender: string; //user id
	timeSent: Timestamp;
	editedAt: Timestamp;
	messageId: string;
	edited: boolean;
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
	ChatGroupsProps,
	ChatInterfaceProps,
	CreateGroupChatProps,
	EditUserProps,
	FirestoreObject,
	LoaderProps,
	MessageProps,
	PopupProps,
	ProviderProps,
	RealtimeObject,
	TooltipProps,
};
