import { useEffect, useRef } from "react";
import { FiSettings } from "react-icons/fi";
import { AppMessage, ChatInterfaceProps } from "../Utility/interfaces";
import { getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ChatInterface.css";
import Loader from "./Loader";
import Message from "./Message";

function ChatInterface(props: ChatInterfaceProps) {
	const { group, messages, onSendMessage, loading } = props;
	const { currentUser } = useAuth()!;
	const msgInputRef = useRef<HTMLInputElement>(null);

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

	return (
		<section className="chat-interface-section">
			<header className="chat-header">
				<div className="chat-header-title">
					<i className="fas fa-comment-alt"></i>
					{group && group.groupName}
				</div>

				<div className="chat-header-options">
					<FiSettings size="18px" />
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
