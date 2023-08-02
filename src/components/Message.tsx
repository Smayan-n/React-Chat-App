import { useRef, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import { AppMessage, MessageProps } from "../Utility/interfaces";
import { getDateFromTimeStamp, getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/Message.css";
import Popup from "./Popup";
import Tooltip from "./Tooltip";

function Message(props: MessageProps) {
	const { message, group } = props;
	const { userCache, deleteMessage, updateMessage } = useFirestore()!;
	const { currentUser } = useAuth()!;
	const [popupOpen, setPopupOpen] = useState(false);
	const [editMsg, setEditMsg] = useState(false);

	const editMsgRef = useRef<HTMLTextAreaElement>(null);

	function getLeftOrRight() {
		if (currentUser && message) {
			if (message.sender === currentUser.uid) {
				return "right-msg";
			} else if (message.sender === "server") {
				return "center-msg";
			} else {
				return "left-msg";
			}
		}
		return "";
	}

	function handleDeleteMessage() {
		deleteMessage(group.groupId, message.messageId);
	}

	function handleEditMessage() {
		setEditMsg(true);
	}

	function handleEditSubmit() {
		if (editMsgRef.current) {
			const newMessage = editMsgRef.current.value;
			message.messageContent = newMessage;
			setEditMsg(false);
			updateMessage(group.groupId, message.messageId, newMessage);
		}
	}

	//neat function to increase textarea height based on content upto a max-height
	function handleTextAreaInput() {
		const textarea = editMsgRef.current;
		if (textarea) {
			textarea.style.height = "auto"; // Reset height to auto
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}

	return (
		<>
			<section className={`msg ${getLeftOrRight()}`}>
				<div className="msg-bubble">
					{message.sender !== "server" && (
						<div className="msg-info">
							<div className="msg-sender">{userCache.get(message.sender)?.username || ""}</div>
							<div className="msg-info-right">
								<div className="msg-time">{getTimeFromTimestamp(message.timeSent, false)}</div>

								<div onClick={() => setPopupOpen(true)} className="msg-options">
									<SlOptionsVertical size="14px" />
									<Tooltip
										position={`tip-bottom ${getLeftOrRight() === "right-msg" ? "tip-left" : ""}`}
									>
										Message Info
									</Tooltip>
									<Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
										<div className="msg-info-popup">
											<div>
												<h4>{`Message Content ${(message.edited && "(edited)") || ""}:`}</h4>
												<div className="msg-info-data">{message.messageContent}</div>
											</div>
											<div>
												<h4>Message Sender: </h4>
												<div className="msg-info-data">
													{userCache.get(message.sender)?.username || ""}
												</div>
											</div>
											<div>
												<h4>Message Sent At: </h4>
												<div className="msg-info-data">
													{`${getDateFromTimeStamp(message.timeSent)}, ${getTimeFromTimestamp(
														message.timeSent,
														true
													)}` || ""}
												</div>
											</div>
											{message.editedAt && (
												<div>
													<h4>Message Edited At: </h4>
													<div className="msg-info-data">
														{`${getDateFromTimeStamp(
															message.editedAt
														)}, ${getTimeFromTimestamp(message.editedAt, true)}` || ""}
													</div>
												</div>
											)}

											{/**only render delete button if current user sent the message */}
											{currentUser && currentUser.uid === message.sender && (
												<button onClick={handleDeleteMessage} className="delete-msg-btn">
													Delete Message
												</button>
											)}
										</div>
									</Popup>
								</div>
							</div>
						</div>
					)}

					<div className={`msg-content-section`}>
						{!editMsg ? (
							<>
								<div className="msg-content">{message.messageContent}</div>

								{message.edited ? <div className="msg-edited-alert">(edited)</div> : ""}
								<div onClick={handleEditMessage} className="msg-edit-icon">
									<FiEdit2 size="16.5px" />
								</div>
							</>
						) : (
							<>
								<textarea
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleEditSubmit();
										}
									}}
									ref={editMsgRef}
									defaultValue={message.messageContent}
									className="edit-msg-input"
									onInput={handleTextAreaInput}
									onMouseEnter={handleTextAreaInput}
								></textarea>
							</>
						)}
					</div>
				</div>
			</section>
		</>
	);
}

export default Message;
