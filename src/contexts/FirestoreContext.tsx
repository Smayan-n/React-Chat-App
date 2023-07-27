import { Unsubscribe, User } from "firebase/auth";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { firestoreDB } from "../Utility/firebase";
import { AppGroup, AppMessage, AppUser, FirestoreObject, FirestoreProviderProps } from "../Utility/interfaces";
import { sortMessagesByTime } from "../Utility/utilityFunctions";
import { useAuth } from "./AuthContext";

const FirestoreContext = React.createContext<FirestoreObject | null>(null);

function useFirestore() {
	return useContext(FirestoreContext);
}

function FirestoreProvider(props: FirestoreProviderProps) {
	const { children } = props;
	const { currentUser } = useAuth()!;

	const [chatGroups, setChatGroups] = useState<AppGroup[]>([]);
	const [messages, setMessages] = useState<AppMessage[]>([]);
	const unsubRef = useRef<Unsubscribe>();

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

		//filter users to not include current user
		const filteredUsers = users.filter((user: AppUser) => user.uid !== currentUser!.uid);

		return new Promise<AppUser[]>((resolve) => {
			resolve(filteredUsers);
		});
	}

	//NOTE:: handle and fix function without proper promise handling

	async function addGroupToDatabase(groupMembers: AppUser[], groupName: string) {
		//make a new chat group with user1 and user2 as members
		const ref = collection(firestoreDB, "chatGroups");
		//create a new group document with auto generated id
		const groupRef = await addDoc(ref, {
			createdAt: serverTimestamp(),
			createdBy: currentUser?.uid,
			members: [...groupMembers.map((member: AppUser) => member.uid), currentUser!.uid],
			groupName: groupName,
		});
		//add a groupId field to the group document
		await updateDoc(groupRef, {
			groupId: groupRef.id,
		});
	}

	async function updateGroup(groupId: string, groupMembers: AppUser[], groupName: string) {
		const ref = doc(firestoreDB, `chatGroups/${groupId}`);
		await updateDoc(ref, {
			members: [...groupMembers.map((member: AppUser) => member.uid)],
			groupName: groupName,
		});
	}

	async function addMessageToDatabase(groupId: string, message: string, uid: string) {
		const ref = collection(firestoreDB, `chatGroups/${groupId}/messages`);
		await addDoc(ref, {
			messageContent: message,
			sender: uid,
			timeSent: serverTimestamp(),
		});
	}

	//NOTE: use caching - look at firebase docs
	function listenToMsgsFrom(groupId: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			//unsubscribe from last snapshot listener
			unsubRef.current && unsubRef.current();

			//attach new listener to given group
			const ref = collection(firestoreDB, `chatGroups/${groupId}/messages`);
			const q = query(ref);
			const unsubscribe = onSnapshot(
				q,
				(querySnapshot) => {
					const msgs: AppMessage[] = [];
					querySnapshot.forEach((doc) => {
						//ServerTimestamp() updates doc value on server so first snapshot call causes time to be null
						//if timesent is null, errors are caused...
						doc.data().timeSent && msgs.push(doc.data() as AppMessage);
					});
					//sort messages by time sent
					setMessages(sortMessagesByTime(msgs));
					resolve();
				},
				(error) => {
					console.log(error);
					reject(error);
				}
			);

			unsubRef.current = unsubscribe;
		});
	}

	useEffect(() => {
		//reset messages array on each re-render to prevent other users viewing wrong messages
		setMessages([]);

		//add onSnapshot to update chatGroups automatically
		let unsubGroupSnapshot: Unsubscribe | null = null;
		if (currentUser) {
			const ref = collection(firestoreDB, "chatGroups");
			const groupsQuery = query(ref, where("members", "array-contains", currentUser.uid));
			unsubGroupSnapshot = onSnapshot(
				groupsQuery,
				(querySnapshot) => {
					const groups: AppGroup[] = [];
					querySnapshot.forEach((doc) => {
						groups.push(doc.data() as AppGroup);
					});
					setChatGroups(groups);
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			//
		}

		return () => {
			//unsub message snapshot
			unsubRef.current && unsubRef.current();
			unsubGroupSnapshot && unsubGroupSnapshot();
		};
	}, [currentUser]);

	const value: FirestoreObject = {
		updateGroup,
		findUsersWithName,
		addGroupToDatabase,
		addMessageToDatabase,
		listenToMsgsFrom,
		chatGroups,
		messages,
	};

	return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>;
}

export { FirestoreProvider, useFirestore };
