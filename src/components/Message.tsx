import { useState } from "react";
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
	const { userCache, deleteMessage } = useFirestore()!;
	const { currentUser } = useAuth()!;
	const [popupOpen, setPopupOpen] = useState(false);

	function getLeftOrRight(msg: AppMessage) {
		if (currentUser) {
			if (msg.sender === currentUser.uid) {
				return "right-msg";
			} else if (msg.sender === "server") {
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

	return (
		<>
			<section className={`msg ${getLeftOrRight(message)}`}>
				<div className="msg-bubble">
					{message.sender !== "server" && (
						<div className="msg-info">
							<div className="msg-sender">{userCache.get(message.sender)?.username || ""}</div>
							<div className="msg-info-right">
								<div className="msg-time">{getTimeFromTimestamp(message.timeSent, false)}</div>

								<div onClick={() => setPopupOpen(true)} className="msg-options">
									<SlOptionsVertical size="14px" />
									<Tooltip
										position={`tip-bottom ${
											getLeftOrRight(message) === "right-msg" ? "tip-left" : ""
										}`}
									>
										Message Info
									</Tooltip>
									<Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
										<div className="msg-info-popup">
											<div>
												<h4>Message Content: </h4>
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

					<div className="msg-content">{message.messageContent}</div>
					{/* <input className="edit-msg-input" type="text"></input> */}
				</div>
			</section>
		</>
	);
}

export default Message;
