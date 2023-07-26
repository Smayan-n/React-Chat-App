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

async function findUsersWithName(searchTerm: string): Promise<AppUser[]> {
	const ref = collection(firestoreDB, "users");

	//queries all names starting with searchTerm
	const usersQuery = query(
		ref,
		where("username", ">=", searchTerm),
		where("username", "<=", searchTerm.toLowerCase() + "\uf8ff") //any string of chars after searchTerm
	);
	const querySnapshot = await getDocs(usersQuery);
	const users: AppUser[] = [];
	querySnapshot.forEach((doc) => {
		users.push(doc.data() as AppUser);
	});

	return new Promise<AppUser[]>((resolve) => {
		resolve(users);
	});
}

export { addUserToDatabase, findUsersWithName, getAppUser };
