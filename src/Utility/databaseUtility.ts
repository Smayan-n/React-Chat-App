import { User } from "firebase/auth";
import {
	DocumentSnapshot,
	QuerySnapshot,
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	setDoc,
} from "firebase/firestore";
import { firestoreDB } from "./firebase";
import { AppGroup, AppMessage, AppObjects, AppUser } from "./interfaces";

function addUserToDatabase(user: User) {
	const ref = doc(firestoreDB, "users", user.uid);
	void setDoc(ref, {
		username: user.displayName?.toLowerCase(),
		email: user.email,
		uid: user.uid,
	});
}

async function getAppUser(uid: string): Promise<AppUser | null> {
	//return an AppUser object from a user uid
	const ref = doc(firestoreDB, `users/${uid}`);
	const docSnap = await getDoc(ref);

	return new Promise<AppUser>((resolve, reject) => {
		docSnap.exists() ? resolve(docSnap.data() as AppUser) : reject(null);
	});
}

async function getUsersFromIds(ids: string[]): Promise<AppUser[]> {
	//return an array of AppUser objects from an array of user ids
	const users: AppUser[] = [];
	const promises: Promise<DocumentSnapshot>[] = [];
	ids.forEach((id) => {
		const ref = doc(firestoreDB, `users/${id}`);
		promises.push(getDoc(ref));
	});
	const docs: DocumentSnapshot[] = await Promise.all(promises);
	docs.forEach((doc) => {
		if (doc.exists()) {
			users.push(doc.data() as AppUser);
		}
	});
	return users;
}

async function getLatestMessagesFrom(groups: AppGroup[]) {
	const messages = new Map<string, AppObjects>();
	for (const { groupId } of groups) {
		const ref = collection(firestoreDB, `chatGroups/${groupId}/messages`);
		const q = query(ref, orderBy("timeSent", "desc"), limit(1));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			const message = querySnapshot.docs[0].data() as AppMessage;
			const user: AppUser | null = await getAppUser(message.sender);
			messages.set(groupId, { message: querySnapshot.docs[0].data() as AppMessage, user: user });
		}
	}

	return messages;
}

export { addUserToDatabase, getAppUser, getLatestMessagesFrom, getUsersFromIds };
