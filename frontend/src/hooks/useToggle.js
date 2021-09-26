import { useState } from "react";

const useToggle = (initialValue = false) => {
	const [value, setValue] = useState(initialValue || false);

	const toggleValue = () => setValue((val) => !val);

	return [value, toggleValue];
};

export default useToggle;