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

	//NOTE:: handle and fix function without proper promise handling

	async function addGroupToDatabase(user1: AppUser, user2: AppUser) {
		//make a new chat group with user1 and user2 as members
		const ref = collection(firestoreDB, "chatGroups");
		//create a new group document with auto generated id
		const groupRef = await addDoc(ref, {
			createdAt: serverTimestamp(),
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
			groups: [groupRef.id],
		});
		await updateDoc(user2Ref, {
			groups: [groupRef.id],
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
	function listenToMsgsFrom(groupId: string) {
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
				setMessages(msgs);
			},
			(error) => {
				console.log(error);
			}
		);

		unsubRef.current = unsubscribe;
	}

	useEffect(() => {
		//reset messages array on each re-render to prevent other users viewing wrong messages
		setMessages([]);

		//add onSnapshot to update chatGroups automatically
		if (currentUser) {
			const ref = collection(firestoreDB, "chatGroups");
			const groupsQuery = query(ref, where("members", "array-contains", currentUser.uid));
			getDocs(groupsQuery)
				.then((querySnapshot) => {
					const groups: AppGroup[] = [];
					querySnapshot.forEach((doc) => {
						groups.push(doc.data() as AppGroup);
					});
					setChatGroups(groups);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			//
		}

		return () => {
			unsubRef.current && unsubRef.current();
		};
	}, [currentUser]);

	const value: FirestoreObject = {
		addGroupToDatabase,
		addMessageToDatabase,
		listenToMsgsFrom,
		chatGroups,
		messages,
	};

	return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>;
}

export { FirestoreProvider, useFirestore };
