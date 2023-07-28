import { Timestamp } from "firebase/firestore";
import { AppMessage } from "./interfaces";

function replaceAll(str: string, find: string, replace: string) {
	//"g" flag finds all occurrence and replace them
	return str.replace(new RegExp(find, "g"), replace);
}

//returns time in format HH:MM OR HH:MM:SS AM/PM
function getTimeFromTimestamp(timestamp: Timestamp, includeSecs?: boolean) {
	//converts timestamp to date object
	const date = timestamp.toDate();
	let hours = date.getHours();
	const ampm = hours > 12 ? "PM" : "AM";
	hours = hours % 12;
	if (hours === 0) hours = 12;
	const mins = date.getMinutes();
	const seconds = date.getSeconds();

	const time = `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? `0${mins}` : mins}`;
	//only include seconds if specified
	return (includeSecs ? time + `:${seconds < 10 ? `0${seconds}` : seconds}` : time) + ` ${ampm}`;
}
function getDateFromTimeStamp(timestamp: Timestamp, fullDate?: boolean) {
	if (fullDate) {
		return timestamp.toDate().toDateString();
	}
	return timestamp.toDate().toLocaleDateString();
}
export { getDateFromTimeStamp, getTimeFromTimestamp, replaceAll };
