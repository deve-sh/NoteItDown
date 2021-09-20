import { writable } from "svelte/store";

const user = writable(localStorage.getItem("note-it-down-user") || null);

user.subscribe((newUserValue) =>
	localStorage.setItem("note-it-down-user", JSON.stringify(newUserValue))
);

export default user;
