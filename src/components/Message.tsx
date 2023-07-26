import { useEffect, useState } from "react";
import { getAppUser } from "../Utility/databaseUtility";
import { AppUser, MessageProps } from "../Utility/interfaces";
import { getTimeFromTimestamp } from "../Utility/utilityFunctions";
import "../styles/Message.css";

function Message(props: MessageProps) {
	const { message, leftorright } = props;
	const [senderName, setSenderName] = useState<string>("");

	//make a cache function so you don't have to keep querying the database
	useEffect(() => {
		async function getSenderName() {
			const sender = await getAppUser(message.sender);
			sender && setSenderName(sender?.username);
		}
		void getSenderName();
	}, []);

	return (
		<>
			{/*Only render message when sender's name is retrieved from database */}
			{senderName && (
				<section className={`msg ${leftorright}`}>
					<div className="msg-bubble">
						<div className="msg-info">
							<div className="msg-sender">{senderName}</div>
							<div className="msg-time">{getTimeFromTimestamp(message.timeSent)}</div>
						</div>
						<div className="msg-content">{message.messageContent}</div>
					</div>
				</section>
			)}
		</>
	);
}

export default Message;
