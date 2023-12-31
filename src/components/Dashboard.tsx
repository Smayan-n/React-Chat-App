import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppGroup } from "../Utility/interfaces";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import { useRealtime } from "../contexts/RealtimeContext";
import "../styles/Dashboard.css";
import ChatGroups from "./ChatGroups";
import ChatInterface from "./ChatInterface";
import NavBar from "./NavBar";

function Dashboard() {
	const { currentUser } = useAuth()!;
	const { chatGroups, listenToMsgsFrom } = useFirestore()!;
	const { listenToTypingFrom, setUserTyping } = useRealtime()!;

	const [loading, setLoading] = useState(false);

	const [currentGroup, setCurrentGroup] = useState<AppGroup | null>(null);
	const userLoadingRef = useRef(true);

	const navigate = useNavigate();

	//go back to login page is user is not signed in
	useEffect(() => {
		//when currentUser is set, update reference
		if (currentUser) {
			userLoadingRef.current = false;
		}

		setTimeout(() => {
			//navigate out of dashboard after a delay - making sure user currentUser has time to be set if logged in
			if (userLoadingRef.current) {
				navigate("/login");
			}
		}, 800);
	}, [currentUser, navigate]);

	//a makeshift way to prevent the group chats and messages from overflowing off the page
	const mainChatsSectionRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		//resize main section based on screen size
		function onResize() {
			if (mainChatsSectionRef.current) {
				mainChatsSectionRef.current.style.maxHeight = (window.innerHeight - 77).toString() + "px";
			}
		}
		window.addEventListener("resize", onResize);
		onResize();

		//cleanup listeners
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		//set currentGroup if current user was removed from group
		if (currentGroup && chatGroups) {
			if (!chatGroups.includes(currentGroup)) {
				setCurrentGroup(null);
			}
		}
		// when group is edited, set current group to updated one from database - so it is properly rendered in chatInterface
		if (currentGroup) {
			chatGroups.forEach((group: AppGroup) => {
				if (group.groupId === currentGroup.groupId) {
					setCurrentGroup(group);
				}
			});
			//this is to render a empty chatInterface when users have no groups
			if (chatGroups.length === 0) {
				setCurrentGroup(null);
			}
		}
	}, [chatGroups, currentGroup, currentUser]);

	function handleGroupSet(groupOn: AppGroup) {
		//make sure group is different to prevent unnecessary re-renders
		if (groupOn.groupId === currentGroup?.groupId) {
			return;
		}

		//set user typing for previous group to false
		currentGroup && currentUser && setUserTyping(currentGroup.groupId, currentUser.uid, false);

		setLoading(true);
		setCurrentGroup(groupOn);
		listenToMsgsFrom(groupOn.groupId)
			.then(() => {
				setTimeout(() => {
					setLoading(false);
				}, 200);
			})
			.catch((error) => {
				console.log(error);
			});
		void listenToTypingFrom(groupOn.groupId);
	}

	return (
		<>
			<section className="dashboard-section">
				{/* {loading && <Loader message="Loading..." />} */}
				<NavBar />

				<div ref={mainChatsSectionRef} className="main-chats-section">
					<ChatGroups
						// groupSectionRef={groupSectionRef}
						currentGroup={currentGroup}
						groups={chatGroups}
						onGroupSet={handleGroupSet}
					/>
					<ChatInterface loading={loading} group={currentGroup} />
				</div>
			</section>
		</>
	);
}

export default Dashboard;
