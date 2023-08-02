import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiFillInfoCircle, AiOutlineArrowDown } from "react-icons/ai";
import { AppMessage, ChatInterfaceProps } from "../Utility/interfaces";
import { getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import { useRealtime } from "../contexts/RealtimeContext";
import "../styles/ChatInterface.css";
import CreateGroupChat from "./CreateGroupChat";
import Loader from "./Loader";
import Message from "./Message";
import Popup from "./Popup";
import Tooltip from "./Tooltip";

function ChatInterface(props: ChatInterfaceProps) {
	const { group, loading } = props;
	const { currentUser } = useAuth()!;
	const { addMessageToDatabase, messages, userCache } = useFirestore()!;
	const { setUserTyping, groupUsersTyping } = useRealtime()!;

	const msgInputRef = useRef<HTMLInputElement>(null);

	const [popupOpen, setPopupOpen] = useState(false);
	const [popup2Open, setPopup2Open] = useState(false);
	const [msgSendLoading, setMsgSendLoading] = useState(false);

	const dummyRef = useRef<HTMLDivElement>(null);

	const mainChatAreaRef = useRef<HTMLDivElement>(null);
	const [atChatBottom, setAtChatBottom] = useState(true);
	const [newMessages, setNewMessages] = useState(0);
	const numMessagesRef = useRef(messages.length);

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

	function scrollToBottom() {
		dummyRef.current?.scrollIntoView({ behavior: "smooth" });
	}

	useEffect(() => {
		const chatElement = mainChatAreaRef.current;

		function handleScroll() {
			if (chatElement) {
				if (chatElement.scrollHeight - chatElement.scrollTop - chatElement.clientHeight <= 50) {
					setAtChatBottom(true);
					setNewMessages(0);
				} else {
					setAtChatBottom(false);
				}
			}
		}

		if (chatElement) {
			chatElement.addEventListener("scroll", handleScroll);
		}

		//cleanup - remove listeners
		return () => {
			chatElement && chatElement.removeEventListener("scroll", handleScroll);
		};

		//dependency is group because effect is not called when a ref changes
	}, [group]);

	useEffect(() => {
		//run only once
		if (numMessagesRef.current !== messages.length) {
			numMessagesRef.current = messages.length;
			//scroll after timeout because messages take time to be rendered after sending
			setTimeout(() => {
				// setUserRecentSentMsg(null);
				const chatElement = mainChatAreaRef.current;
				if (chatElement) {
					if (atChatBottom) {
						scrollToBottom();
						setNewMessages(0);
					} else {
						setNewMessages(newMessages + 1);
					}
				}
			}, 10);
		}
	}, [messages, atChatBottom, newMessages]);

	async function handleSendMessage(message: string) {
		setMsgSendLoading(true);
		await addMessageToDatabase(group!.groupId, message, currentUser!.uid);
		setMsgSendLoading(false);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (msgInputRef.current) {
			//make sure message is not empty
			const msg = msgInputRef.current.value;
			if (msg) {
				void handleSendMessage(msgInputRef.current?.value);
				//when user sends message, make sure it auto scrolls
				setAtChatBottom(true);

				//clear input and set user typing to false
				msgInputRef.current.value = "";
				group && currentUser && setUserTyping(group.groupId, currentUser?.uid, false);
			}
		}
	}

	function getUsersTyping() {
		const usersTyping: string[] = [];
		groupUsersTyping.forEach((value, key) => {
			if (value) {
				//don't include current user as typing
				const user = userCache.get(key);
				if (user?.uid !== currentUser?.uid && user) usersTyping.push(user.username);
			}
		});
		return usersTyping.join(" and ");
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
				{/* {msgSendLoading && <Loader message="Sending..." />} */}

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
						<div role="button" onClick={() => setPopupOpen(true)} className="edit-chat-btn">
							<AiFillEdit size="23px" />
							<Tooltip position="tip-bottom">Edit Chat</Tooltip>
							<Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
								<CreateGroupChat group={group} onClose={() => setPopupOpen(false)} />
							</Popup>
						</div>
					</div>
				</header>

				<div className="main-chat-area-outer">
					<div ref={mainChatAreaRef} className="main-chat-area">
						{messages.length === 0 && <section className="no-messages">No messages</section>}

						{messages.length > 0 &&
							messages.map((msg: AppMessage) => {
								return (
									<Message
										key={getTimeFromTimestamp(msg.timeSent, true)}
										message={msg}
										group={group}
									/>
								);
							})}

						{/* <div className="msg-date-div">Hello</div> */}
						<div className="dummy-div" ref={dummyRef}></div>
					</div>
					{loading && <Loader message="Loading Messages" />}

					{/*show which users are typing */}
					{getUsersTyping() === "" ? null : (
						<div className="typing-div">{`${getUsersTyping()} is typing...`}</div>
					)}

					{!atChatBottom && (
						<div onClick={scrollToBottom} className="scroll-down-btn">
							<AiOutlineArrowDown size="32px" />
							<Tooltip>To Bottom</Tooltip>
							{(newMessages && `${newMessages} new message(s)`) || ""}
						</div>
					)}
				</div>

				<form onSubmit={handleSubmit} className="chat-input-form">
					{messages && ""}
					<input
						onChange={(e) => {
							if (currentUser && group) {
								if (e.target.value.trim() === "") {
									setUserTyping(group.groupId, currentUser?.uid, false);
								} else {
									setUserTyping(group.groupId, currentUser?.uid, true);
								}
							}
						}}
						defaultValue={""}
						ref={msgInputRef}
						type="text"
						className="msg-input"
						placeholder="Type a message..."
					/>
					<button type="submit" className="send-msg-btn">
						Send
					</button>
				</form>
			</section>
		</>
	);
}

export default ChatInterface;
