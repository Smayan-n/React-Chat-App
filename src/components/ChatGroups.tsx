import { useEffect, useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { AppGroup, ChatGroupsProps } from "../Utility/interfaces";
import "../styles/ChatGroups.css";
import CreateGroupChat from "./CreateGroupChat";
import Popup from "./Popup";

function ChatGroups(props: ChatGroupsProps) {
	const { groups, onGroupSet } = props;
	const [popupOpen, setPopupOpen] = useState(false);

	return (
		<>
			<section className="chat-groups-section">
				<header className="groups-header">
					<h2 className="groups-title">Chats</h2>
					<div onClick={() => setPopupOpen(true)} className="create-chat-btn">
						<IoIosCreate size="27px" color="white" />
						<Popup onClose={() => setPopupOpen(false)} isOpen={popupOpen}>
							<CreateGroupChat onClose={() => setPopupOpen(false)} />
						</Popup>
					</div>
				</header>
				<section className="groups">
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
								<section key={group.groupId} onClick={() => onGroupSet(group)} className="chat-group">
									<div className="group-info-section">
										<h4 className="group-title">{group.groupName}</h4>
										<div className="last-msg-time">7/22/2023</div>
									</div>
									<div className="latest-msg">Message</div>
								</section>
							);
						})}
				</section>
			</section>
		</>
	);
}

export default ChatGroups;
