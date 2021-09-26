import { writable } from "svelte/store";

const getUserFromLocalStorage = () => {
	try {
		return JSON.parse(localStorage.getItem("note-it-down-user")) || null;
	} catch (err) {
		return null;
	}
};

const user = writable(getUserFromLocalStorage());

user.subscribe((newUserValue) =>
	localStorage.setItem("note-it-down-user", JSON.stringify(newUserValue))
);

export default user;
