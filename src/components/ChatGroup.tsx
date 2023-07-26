import { ChatGroupProps } from "../Utility/interfaces";
import "../styles/ChatGroup.css";

function ChatGroup(props: ChatGroupProps) {
	const { group, onGroupSet } = props;

	return (
		<section onClick={() => onGroupSet(group)} className="chat-group-section">
			<div className="group-info-section">
				<div className="group-title">{group.groupId.substring(0, 10)}</div>
				<div className="last-msg-time">7/22/2023</div>
			</div>
			<div className="latest-msg">Message</div>
		</section>
	);
}

export default ChatGroup;
