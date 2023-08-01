import { Unsubscribe } from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import React, { useContext, useEffect, useRef, useState } from "react";
import { realtimeDB } from "../Utility/firebase";
import { ProviderProps, RealtimeObject } from "../Utility/interfaces";

const RealtimeContext = React.createContext<RealtimeObject | null>(null);

function useRealtime() {
	return useContext(RealtimeContext);
}

function RealtimeProvider({ children }: ProviderProps) {
	//uid: typing/not typing
	const [groupUsersTyping, setGroupUsersTyping] = useState<Map<string, boolean>>(new Map());
	const unsubRef = useRef<Unsubscribe>();

	//typing status is set up in realtime database like so:
	/*TypingInfo:
		groupId:
			uid: true/false
			uid: true/false
		groupId:
			uid: true/false
			uid: true/false
	*/

	function setUserTyping(groupId: string, userId: string, isTyping?: boolean) {
		const reference = ref(realtimeDB, `typingInfo/${groupId}/${userId}`);
		void set(reference, isTyping || false);
	}

	function listenToTypingFrom(groupId: string) {
		unsubRef.current && unsubRef.current();

		const typingRef = ref(realtimeDB, `typingInfo/${groupId}`);
		const unsubscribe = onValue(typingRef, (snapshot) => {
			const data: Record<string, boolean> = snapshot.val() as Record<string, boolean>;
			if (data) {
				//add all data to map
				const map = new Map();
				for (const key in data) {
					const value = data[key];
					map.set(key, value);
				}
				//not directly updating state because component re-render needed when typing changes
				setGroupUsersTyping(map);
			}
		});

		unsubRef.current = unsubscribe;
	}

	useEffect(() => {
		setGroupUsersTyping(new Map());
	}, []);
	const value: RealtimeObject = {
		setUserTyping,
		listenToTypingFrom,
		groupUsersTyping,
	};
	return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export { RealtimeProvider, useRealtime };
