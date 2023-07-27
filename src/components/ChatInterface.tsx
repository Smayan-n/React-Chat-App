import { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiFillInfoCircle } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { getAppUser } from "../Utility/databaseUtility";
import { AppGroup, AppMessage, AppUser, ChatInterfaceProps } from "../Utility/interfaces";
import { getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ChatInterface.css";
import CreateGroupChat from "./CreateGroupChat";
import Loader from "./Loader";
import Message from "./Message";
import Popup from "./Popup";

function ChatInterface(props: ChatInterfaceProps) {
	const { group, messages, onSendMessage, loading } = props;
	const { currentUser } = useAuth()!;
	const msgInputRef = useRef<HTMLInputElement>(null);
	const [popupOpen, setPopupOpen] = useState(false);

	function getLeftOrRight(msg: AppMessage) {
		if (msg.sender === currentUser!.uid) {
			return "right-msg";
		} else {
			return "left-msg";
		}
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (msgInputRef.current) {
			void onSendMessage(msgInputRef.current?.value);
			//clear input
			msgInputRef.current.value = "";
		}
	}

	//don't render interface if no chats open
	if (!group) {
		return (
			<section className="no-chat-open">
				No chat open!
				<h6>Create a chat or choose one from the left</h6>
			</section>
		);
	}

	return (
		<section className="chat-interface-section">
			<header className="chat-header">
				<div className="chat-header-info">
					<h3 className="chat-header-title">{group && group.groupName}</h3>
					<div className="chat-header-members"></div>
				</div>

				<div className="chat-header-settings">
					<div className="info-chat-btn">
						<AiFillInfoCircle size="22px" />
					</div>
					<div onClick={() => setPopupOpen(true)} className="edit-chat-btn">
						<AiFillEdit size="23px" />
						<Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
							<CreateGroupChat group={group} onClose={() => setPopupOpen(false)} />
						</Popup>
					</div>
				</div>
			</header>

			<div className="main-chat-area">
				{loading && <Loader message="Loading chats" />}
				{messages.length > 0 &&
					messages.map((msg: AppMessage) => {
						return (
							<Message
								key={getTimeFromTimestamp(msg.timeSent, true)}
								message={msg}
								leftorright={getLeftOrRight(msg)}
							/>
						);
					})}
			</div>

			<form onSubmit={handleSubmit} className="chat-input-form">
				<input ref={msgInputRef} type="text" className="msg-input" placeholder="Enter your message..." />
				<button type="submit" className="send-msg-btn">
					Send
				</button>
			</form>
		</section>
	);
}

export default ChatInterface;
