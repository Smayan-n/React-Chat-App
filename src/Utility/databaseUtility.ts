import { User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { firestoreDB } from "./firebase";
import { AppUser } from "./interfaces";

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

export { addUserToDatabase, getAppUser };
