import { useEffect, useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { getLatestMessagesFrom } from "../Utility/databaseUtility";
import { AppGroup, AppMessage, ChatGroupsProps } from "../Utility/interfaces";
import { getDateFromTimeStamp } from "../Utility/utilityFunctions";
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
	const [latestMessages, setLatestMessages] = useState<Map<string, AppMessage> | null>(null);

	const { userCache } = useFirestore()!;

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

	function getLatestMessageTime(group: AppGroup) {
		if (latestMessages) {
			const message: AppMessage | undefined = latestMessages.get(group.groupId);
			if (message) {
				return getDateFromTimeStamp(message.timeSent);
			}
		}
		return "";
	}

	function getLatestMessage(group: AppGroup) {
		//return group usernames
		// const members: string[] = [];
		// group.members.forEach((member) => {
		// 	members.push(userCache.get(member)?.username as string);
		// });
		// return members.join(", ");
		if (latestMessages) {
			const message: AppMessage | undefined = latestMessages.get(group.groupId);
			if (message) {
				return ((userCache.get(message.sender)?.username as string) || "___") + ": " + message.messageContent;
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

					{/*unique key prop warning? */}
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
										<div className="last-msg-time">{getLatestMessageTime(group)}</div>
									</div>
									<div className="latest-msg">{getLatestMessage(group)}</div>
								</section>
							);
						})}
				</section>
			</section>
		</>
	);
}

export default ChatGroups;
