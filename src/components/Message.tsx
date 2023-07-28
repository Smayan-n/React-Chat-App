import { MessageProps } from "../Utility/interfaces";
import { getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/Message.css";

function Message(props: MessageProps) {
	const { message, leftorright } = props;
	const { userCache } = useFirestore()!;

	return (
		<>
			<section className={`msg ${leftorright}`}>
				<div className="msg-bubble">
					<div className="msg-info">
						<div className="msg-sender">{userCache.get(message.sender)?.username || ""}</div>
						<div className="msg-time">{getTimeFromTimestamp(message.timeSent, false)}</div>
					</div>
					<div className="msg-content">{message.messageContent}</div>
				</div>
			</section>
		</>
	);
}

export default Message;
