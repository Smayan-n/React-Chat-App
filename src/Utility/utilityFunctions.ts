function replaceAll(str: string, find: string, replace: string) {
	//"g" flag finds all occurrence and replace them
	return str.replace(new RegExp(find, "g"), replace);
}

export { replaceAll };
