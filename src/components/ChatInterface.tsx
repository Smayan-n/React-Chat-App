import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiFillInfoCircle } from "react-icons/ai";
import { AppMessage, ChatInterfaceProps } from "../Utility/interfaces";
import { getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/ChatInterface.css";
import CreateGroupChat from "./CreateGroupChat";
import Loader from "./Loader";
import Message from "./Message";
import Popup from "./Popup";
import Tooltip from "./Tooltip";

function ChatInterface(props: ChatInterfaceProps) {
	const { group, loading } = props;
	const { currentUser } = useAuth()!;
	const { addMessageToDatabase, messages } = useFirestore()!;

	const msgInputRef = useRef<HTMLInputElement>(null);

	const [popupOpen, setPopupOpen] = useState(false);
	const [popup2Open, setPopup2Open] = useState(false);

	const dummyRef = useRef<HTMLDivElement>(null);

	//section resizing logic - user can freely change chats section and group section size
	const sliderSectionRef = useRef<HTMLDivElement>(null);
	const chatInterfaceRef = useRef<HTMLElement>(null);
	let sliderSectionClicked = false;

	useEffect(() => {
		function onSectionResize(e: MouseEvent) {
			if (sliderSectionClicked) {
				if (chatInterfaceRef.current) {
					const winWidth = window.innerWidth;
					let chatInterfaceWidth = Math.floor(((winWidth - e.clientX) / winWidth) * 100);
					if (chatInterfaceWidth < 35) chatInterfaceWidth = 35;
					if (chatInterfaceWidth > 75) chatInterfaceWidth = 75;
					chatInterfaceRef.current.style.width = chatInterfaceWidth.toString() + "%";
				}
			}
		}
		function handleMouseDown() {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			sliderSectionClicked = true;
		}
		function handleMouseUp() {
			sliderSectionClicked = false;
		}

		const sliderSection = sliderSectionRef.current;
		if (sliderSection) {
			sliderSection.addEventListener("mousedown", handleMouseDown);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("mousemove", onSectionResize);
		}

		//cleanup
		return () => {
			if (sliderSection) {
				sliderSection.removeEventListener("mousedown", handleMouseDown);
				window.removeEventListener("mouseup", handleMouseUp);
				window.removeEventListener("mousemove", onSectionResize);
			}
		};
	}, [group]);

	useEffect(() => {
		//scroll after some time because messages take time to be rendered after sending

		setTimeout(() => {
			// setUserRecentSentMsg(null);
			dummyRef.current && dummyRef.current.scrollIntoView({ behavior: "smooth" });
		}, 250);

		// console.log(messagesToDisp);
	}, [messages]);

	async function handleSendMessage(message: string) {
		await addMessageToDatabase(group!.groupId, message, currentUser!.uid);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (msgInputRef.current) {
			// setUserRecentSentMsg({
			// 	messageContent: msgInputRef.current?.value,
			// 	sender: currentUser!.uid,
			// 	timeSent: Timestamp.fromDate(new Date()),
			// });

			//make sure message is not empty
			msgInputRef.current.value.trim() && void handleSendMessage(msgInputRef.current?.value);

			//clear input
			msgInputRef.current.value = "";
		}
	}

	//don't render interface if no chats open
	if (!group) {
		return (
			<section className="no-chat-open">
				No chat open!
				<h6>Create a chat or open one from the left</h6>
			</section>
		);
	}

	return (
		<>
			<div ref={sliderSectionRef} className="section-slider"></div>
			<section ref={chatInterfaceRef} className="chat-interface-section">
				{loading && <Loader message="Loading Messages" />}

				<header className="chat-header">
					<div className="chat-header-info">
						<h2 className="chat-header-title">{group && group.groupName}</h2>
						<div className="chat-header-members"></div>
					</div>

					<div className="chat-header-settings">
						<div onClick={() => setPopup2Open(true)} className="info-chat-btn">
							<AiFillInfoCircle size="22px" />
							<Tooltip position="tip-bottom">Group Info</Tooltip>
							<Popup isOpen={popup2Open} onClose={() => setPopup2Open(false)}>
								<CreateGroupChat info group={group} />
							</Popup>
						</div>
						<div onClick={() => setPopupOpen(true)} className="edit-chat-btn">
							<AiFillEdit size="23px" />
							<Tooltip position="tip-bottom">Edit Chat</Tooltip>
							<Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
								<CreateGroupChat group={group} onClose={() => setPopupOpen(false)} />
							</Popup>
						</div>
					</div>
				</header>

				<div className="main-chat-area">
					{messages.length === 0 && <section className="no-messages">No messages</section>}

					{messages.length > 0 &&
						messages.map((msg: AppMessage) => {
							return (
								<Message key={getTimeFromTimestamp(msg.timeSent, true)} message={msg} group={group} />
							);
						})}

					<div className="dummy-div" ref={dummyRef}></div>
				</div>

				<form onSubmit={handleSubmit} className="chat-input-form">
					<input ref={msgInputRef} type="text" className="msg-input" placeholder="Type a message..." />
					<button type="submit" className="send-msg-btn">
						Send
					</button>
				</form>
			</section>
		</>
	);
}

export default ChatInterface;
