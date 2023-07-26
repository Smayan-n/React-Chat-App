import { useRef } from "react";
import { AppMessage, ChatInterfaceProps } from "../Utility/interfaces";
import { getTimeFromTimestamp, sortMessagesByTime } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ChatInterface.css";
import Message from "./Message";

function ChatInterface(props: ChatInterfaceProps) {
	const { group, messages, onSendMessage } = props;
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
					{group && group.groupId}
				</div>

				<div className="chat-header-options">
					<span>
						<i className="fas fa-cog"></i>
					</span>
				</div>
			</header>

			<div className="main-chat-area">
				{messages.length > 0 &&
					sortMessagesByTime(messages).map((msg: AppMessage) => {
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
