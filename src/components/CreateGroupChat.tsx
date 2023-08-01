import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { AppUser, CreateGroupChatProps } from "../Utility/interfaces";
import { getDateFromTimeStamp, getTimeFromTimestamp } from "../Utility/utilityFunctions";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/CreateGroupChat.css";
import Alert from "./Alert";

//this component is also used to edit and display group info
//props includes group (for edit) and info (for showing group info)
function CreateGroupChat(props: CreateGroupChatProps) {
	const { onClose, group, info } = props;

	const [users, setUsers] = useState<AppUser[]>([]);
	const [groupMembers, setGroupMembers] = useState<AppUser[]>([]);
	// const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { userCache } = useFirestore()!;

	const groupNameRef = useRef<HTMLInputElement>(null);

	const { addGroupToDatabase, updateGroup, findUsersWithName, deleteGroup } = useFirestore()!;

	//load existing group members if any
	useEffect(() => {
		if (group) {
			const grpMembs: AppUser[] = group?.members.map((memberId: string) => userCache.get(memberId)) as AppUser[];
			setGroupMembers(grpMembs);
		}
	}, [group, userCache]);

	function getGroupCreatorName(uid: string): string {
		const groupCreator = groupMembers.find((member: AppUser) => member.uid === uid);
		return groupCreator ? groupCreator.username : "";
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		// setLoading(true);
		findUsersWithName(e.target.value)
			.then((usersFound: AppUser[]) => {
				//Filter the usersFound array to include only users that are not in usersToAdd
				const filteredUsers = usersFound.filter(
					(user: AppUser) => !groupMembers.some((existing: AppUser) => user.uid === existing.uid)
				);

				// setLoading(false);
				setUsers(filteredUsers);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function handleAddUser(newUser: AppUser) {
		//add selected user to array and remove from main array
		setGroupMembers([...groupMembers, newUser]);
		const filteredUsers = users.filter((user: AppUser) => user.uid !== newUser.uid);
		setUsers(filteredUsers);
	}

	function handleDelUser(userToDel: AppUser) {
		setUsers([...users, userToDel]);
		const filteredUsers = groupMembers.filter((user: AppUser) => user.uid !== userToDel.uid);
		setGroupMembers(filteredUsers);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		//input validations
		const groupName = groupNameRef.current?.value;
		if (groupName === "") {
			setError("Enter a group name!");
			return;
		}
		if (groupMembers.length === 0) {
			setError("Add at least one user to the group");
			return;
		}
		//make sure group is not left with one person
		if (group && groupMembers.length <= 1) {
			setError("Group cannot have only one person!");
			return;
		}

		//create a new group or update depending on case
		if (group) {
			//update
			void updateGroup(group.groupId, groupMembers, groupName as string);
		} else {
			void addGroupToDatabase(groupMembers, groupName as string);
		}

		onClose && onClose();
	}

	return (
		<section className="create-chat-section">
			{error && <Alert autoClose message={error} onClose={() => setError("")} />}
			<h2 className="create-title">
				{group ? (info ? group.groupName : "Edit Group Chat") : "Create a new group chat!"}
			</h2>

			{info && (
				<div>
					<div>
						<h4>group created on: </h4>
						<div className="group-info-data">
							{getDateFromTimeStamp(group!.createdAt, true)},{" "}
							{getTimeFromTimestamp(group!.createdAt, true)}
						</div>
					</div>
					<div className="group-creator">
						<h4>group creator: </h4>
						<div className="group-info-data">{getGroupCreatorName(group!.createdBy)}</div>
					</div>

					{groupMembers.length === 0 ? <div>No users to show</div> : <div>Group members: </div>}
					<div className="users-display">
						{groupMembers &&
							groupMembers.map((user: AppUser) => (
								<div className="user-disp" key={user.uid}>
									<div className="user-disp-info">
										<div className="user-disp-name">{user.username}</div>
										<div className="user-disp-email">{user.email}</div>
									</div>
								</div>
							))}
					</div>
				</div>
			)}

			{/*render form only if this is not for information */}
			{!info && (
				<form onSubmit={handleSubmit} className="create-group-form">
					<input
						defaultValue={group ? group.groupName : ""}
						ref={groupNameRef}
						type="text"
						className="create-group-input"
						placeholder="Chat Name"
					/>
					<input
						onChange={handleInputChange}
						type="text"
						className="create-group-input i"
						placeholder="Search for users..."
					/>

					{groupMembers.length === 0 ? <div>No members</div> : <div>Members:</div>}
					<div className="added-users">
						{groupMembers &&
							groupMembers.map((user: AppUser) => {
								return (
									<div key={user.uid} className="added-user">
										{user.username}
										<div onClick={() => handleDelUser(user)} className="added-user-del">
											&times;
										</div>
									</div>
								);
							})}
					</div>

					{users.length === 0 ? <div>No users to show</div> : <div>Users:</div>}
					<div className="users-display">
						{/* {loading && <div>Loading...</div>} */}
						{users &&
							users.map((user: AppUser) => (
								<div className="user-disp" key={user.uid}>
									<div className="user-disp-info">
										<div className="user-disp-name">{user.username}</div>
										<div className="user-disp-email">{user.email}</div>
									</div>

									<div onClick={() => handleAddUser(user)} className="add-user-btn">
										<IoMdAdd color="green" size="35px" />
									</div>
								</div>
							))}
					</div>

					<button className="create-group-btn" type="submit">
						{group ? "Edit Group" : "Create Group"}
					</button>
					{group && (
						<button onClick={() => deleteGroup(group.groupId)} className="delete-group-btn">
							Delete Group
						</button>
					)}
				</form>
			)}
		</section>
	);
}

export default CreateGroupChat;
