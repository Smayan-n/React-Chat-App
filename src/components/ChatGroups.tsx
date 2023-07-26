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
					<h3 className="groups-title">Chats</h3>
					<div onClick={() => setPopupOpen(true)} className="create-chat-btn">
						<IoIosCreate size="2vw" color="white" />
						<Popup onClose={() => setPopupOpen(false)} isOpen={popupOpen}>
							<CreateGroupChat onClose={() => setPopupOpen(false)} />
						</Popup>
					</div>
				</header>
				<section className="groups">
					{groups &&
						groups.map((group: AppGroup) => {
							return (
								<section key={group.groupId} onClick={() => onGroupSet(group)} className="chat-group">
									<div className="group-info-section">
										<div className="group-title">{group.groupName}</div>
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
