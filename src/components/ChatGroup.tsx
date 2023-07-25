import { ChatGroupProps } from "../Utility/interfaces";
import "../styles/ChatGroup.css";

function ChatGroup(props: ChatGroupProps) {
	const { group, onGroupSet } = props;

	return (
		<section onClick={() => onGroupSet(group)} className="chat-group-section">
			Section
			<div>group: {group.groupId}</div>
		</section>
	);
}

export default ChatGroup;
