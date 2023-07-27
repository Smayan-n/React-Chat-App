import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { getUsersFromIds } from "../Utility/databaseUtility";
import { AppUser, CreateGroupChatProps } from "../Utility/interfaces";
import { useFirestore } from "../contexts/FirestoreContext";
import "../styles/CreateGroupChat.css";
import Loader from "./Loader";

function CreateGroupChat({ onClose, group }: CreateGroupChatProps) {
	const [users, setUsers] = useState<AppUser[]>([]);
	const [usersToAdd, setUsersToAdd] = useState<AppUser[]>([]);
	const [loading, setLoading] = useState(false);

	const groupNameRef = useRef<HTMLInputElement>(null);

	const { addGroupToDatabase, updateGroup, findUsersWithName } = useFirestore()!;

	//load existing group members if any
	useEffect(() => {
		async function setUserArrays() {
			if (group) {
				setLoading(true);
				const groupMembers = await getUsersFromIds(group.members);
				setUsersToAdd(groupMembers);
				setLoading(false);
			}
		}
		void setUserArrays();
	}, [group]);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setLoading(true);
		findUsersWithName(e.target.value)
			.then((usersFound: AppUser[]) => {
				//Filter the usersFound array to include only users that are not in usersToAdd
				const filteredUsers = usersFound.filter(
					(user: AppUser) => !usersToAdd.some((existing: AppUser) => user.uid === existing.uid)
				);

				setLoading(false);
				setUsers(filteredUsers);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function handleAddUser(newUser: AppUser) {
		//add selected user to array and remove from main array
		setUsersToAdd([...usersToAdd, newUser]);
		const filteredUsers = users.filter((user: AppUser) => user.uid !== newUser.uid);
		setUsers(filteredUsers);
	}

	function handleDelUser(userToDel: AppUser) {
		setUsers([...users, userToDel]);
		const filteredUsers = usersToAdd.filter((user: AppUser) => user.uid !== userToDel.uid);
		setUsersToAdd(filteredUsers);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		//create a new group or update depending on groups
		if (group) {
			//update
			void updateGroup(group.groupId, usersToAdd, groupNameRef.current?.value as string);
		} else {
			void addGroupToDatabase(usersToAdd, groupNameRef.current?.value as string);
		}
		//close popup
		onClose();
	}

	return (
		<section className="create-chat-section">
			<h3 className="create-title">{group ? "Edit Group Chat" : "Create a new group chat!"}</h3>
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
					className="create-group-input"
					placeholder="Search for users"
				/>

				{usersToAdd.length === 0 ? <div>No members</div> : <div>Members:</div>}
				<div className="added-users">
					{usersToAdd &&
						usersToAdd.map((user: AppUser) => {
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
			</form>
		</section>
	);
}

export default CreateGroupChat;
