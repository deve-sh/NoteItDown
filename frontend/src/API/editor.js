/**
 * APIs related to Editor
 */

import storage from '../firebase/storage';
import { v4 as uuid } from 'uuid';

const generateUniqueFileName = (fileName) => {
	let uuidString = uuid().replace(/-/g, "");

	if (fileName.split(".").length > 1)
		return uuidString + "." + fileName.split(".").pop();
	else return uuidString;
};

export const uploadImage = async (file) => {
	try {
		return await(
			await(storage.ref(`images/${generateUniqueFileName(file.name)}`)).put(
				file
			)
		).ref.getDownloadURL();
	} catch (err) {
		console.log(err);
		return null;
	}
};
