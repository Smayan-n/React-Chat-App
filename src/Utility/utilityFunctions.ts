import { AppMessage } from "./interfaces";

function replaceAll(str: string, find: string, replace: string) {
	//"g" flag finds all occurrence and replace them
	return str.replace(new RegExp(find, "g"), replace);
}

//returns time in format HH:MM:SS am/pm
function getTime(date: Date) {
	let hours = date.getHours();
	const ampm = hours > 12 ? "PM" : "AM";
	hours = hours % 12;
	const mins = date.getMinutes();
	const seconds = date.getSeconds();

	return `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? `0${mins}` : mins}:${
		seconds < 10 ? `0${seconds}` : seconds
	} ${ampm}`;
}

function sortMessagesByTime(messages: AppMessage[]) {
	return messages.sort((a, b) => a.timeSent.seconds - b.timeSent.seconds);
}

export { getTime, replaceAll, sortMessagesByTime };
