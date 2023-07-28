import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { getLatestMessagesFrom } from "../Utility/databaseUtility";
import { AppGroup, AppMessage, AppObjects, ChatGroupsProps } from "../Utility/interfaces";
import { getDateFromTimeStamp, getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/ChatGroups.css";
import CreateGroupChat from "./CreateGroupChat";
import Loader from "./Loader";
import Popup from "./Popup";
import Tooltip from "./Tooltip";

function ChatGroups(props: ChatGroupsProps) {
	const { groups, currentGroup, onGroupSet } = props;
	const [popupOpen, setPopupOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [latestMessages, setLatestMessages] = useState<Map<string, AppObjects> | null>(null);

	//load latest messages from each group chat
	useEffect(() => {
		async function setMsgs() {
			if (groups) {
				setLoading(true);
				const latest = await getLatestMessagesFrom(groups);
				setLatestMessages(latest);
				setLoading(false);
			}
		}
		void setMsgs();
	}, [groups]);

	function getLatestMessageTime(groupId: string) {
		if (latestMessages) {
			const obj: AppObjects | undefined = latestMessages.get(groupId);
			if (obj?.message) {
				return getDateFromTimeStamp(obj.message.timeSent);
			}
		}
		return "";
	}

	function getLatestMessage(groupId: string) {
		if (latestMessages) {
			const obj: AppObjects | undefined = latestMessages.get(groupId);
			if (obj?.user && obj?.message) {
				return obj.user.username + ": " + obj.message.messageContent;
			}
		}
		return "No messages yet";
	}

	return (
		<>
			<section className="chat-groups-section">
				<header className="groups-header">
					<h2 className="groups-title">Chats</h2>
					<div onClick={() => setPopupOpen(true)} className="create-chat-btn">
						<IoIosCreate size="27px" color="white" />
						<Tooltip position="tip-bottom">Create Group Chat</Tooltip>
						<Popup onClose={() => setPopupOpen(false)} isOpen={popupOpen}>
							<CreateGroupChat onClose={() => setPopupOpen(false)} />
						</Popup>
					</div>
				</header>
				<section className="groups">
					{loading && <Loader message="Loading Chats" />}
					{groups.length === 0 ? (
						<div className="no-group-chats">
							No group chats
							<a className="create-chat-btn" onClick={() => setPopupOpen(true)}>
								create one now!
							</a>
						</div>
					) : (
						""
					)}

					{groups &&
						groups.map((group: AppGroup) => {
							return (
								<section
									key={group.groupId}
									onClick={() => onGroupSet(group)}
									className={`chat-group ${
										currentGroup && group.groupId === currentGroup.groupId ? "group-selected" : ""
									}`}
								>
									<div className="group-info-section">
										<h4 className="group-title">{group.groupName}</h4>
										<div className="last-msg-time">{getLatestMessageTime(group.groupId)}</div>
									</div>
									<div className="latest-msg">{getLatestMessage(group.groupId)}</div>
								</section>
							);
						})}
				</section>
			</section>
		</>
	);
}

export default ChatGroups;
