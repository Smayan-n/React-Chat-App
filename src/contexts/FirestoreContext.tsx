import { User } from "firebase/auth";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { firestoreDB } from "../Utility/firebase";
import { AppMessage, AppUser, FirestoreObject, FirestoreProviderProps } from "../Utility/interfaces";

const FirestoreContext = React.createContext<FirestoreObject | null>(null);

function useFirestore() {
	return useContext(FirestoreContext);
}

function FirestoreProvider(props: FirestoreProviderProps) {
	const { children } = props;

	async function getAppUser(user: User): Promise<AppUser | null> {
		//return an AppUser object from a User object
		const ref = doc(firestoreDB, `users/${user.uid}`);
		const docSnap = await getDoc(ref);

		return new Promise<AppUser>((resolve, reject) => {
			docSnap.exists() ? resolve(docSnap.data() as AppUser) : reject(null);
		});
	}

	//NOTE:: handle and fix function without proper promise handling
	function addUserToDatabase(user: User) {
		const ref = doc(firestoreDB, "users", user.uid);
		void setDoc(ref, {
			username: user.displayName?.toLowerCase(),
			email: user.email,
			uid: user.uid,
		});
	}

	async function addGroupToDatabase(user1: AppUser, user2: AppUser) {
		//make a new chat group with user1 and user2 as members
		const ref = collection(firestoreDB, "chatGroups");
		//create a new group document with auto generated id
		const groupRef = await addDoc(ref, {
			createdAt: new Date(),
			createdBy: user1.uid,
			members: [user1.uid, user2.uid],
		});
		//add a groupId field to the group document
		await updateDoc(groupRef, {
			groupId: groupRef.id,
		});

		//add group ids of new group to each user's groups array
		const user1Ref = doc(firestoreDB, "users", user1.uid);
		const user2Ref = doc(firestoreDB, "users", user2.uid);
		await updateDoc(user1Ref, {
			groups: [...user1.groups, groupRef.id],
		});
		await updateDoc(user2Ref, {
			groups: [...user2.groups, groupRef.id],
		});
	}

	async function addMessageToDatabase(groupId: string, message: string, sender: User) {
		const ref = collection(firestoreDB, `chatGroups/${groupId}/messages`);
		await addDoc(ref, {
			messageContent: message,
			sender: sender.uid,
			timeSent: new Date(),
		});
	}

	async function findUsersWithName(searchTerm: string) {
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

	useEffect(() => {
		const ref = collection(firestoreDB, "chatGroups/zCkqr48ja7YuQqcgNT0L/messages");
		const q = query(ref);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const messages: AppMessage[] = [];
			querySnapshot.forEach((doc) => {
				messages.push(doc.data() as AppMessage);
			});
			console.log(messages);
		});

		return () => {
			unsubscribe();
		};
	});

	const value: FirestoreObject = {
		addUserToDatabase,
		findUsersWithName,
		addGroupToDatabase,
		addMessageToDatabase,
		getAppUser,
	};

	return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>;
}

export { FirestoreProvider, useFirestore };
