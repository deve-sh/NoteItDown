import {
	FormControl as ChakraFormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
	Input,
} from "@chakra-ui/react";

const FormControl = ({
	value,
	id,
	className,
	label,
	onChange,
	placeholder,
	type,
	errorMessage,
	required,
	disabled,
	name,
	helperText,
	variant,
}) => (
	<ChakraFormControl
		id={id}
		className={className}
		isRequired={required}
		isReadOnly={disabled}
		name={name}
		variant={variant || "outlined"}
	>
		<FormLabel>{label}</FormLabel>
		<Input
			type={type}
			onChange={onChange}
			placeholder={placeholder}
			name={name}
			disabled={disabled}
			value={value}
		/>
		{errorMessage ? (
			<FormErrorMessage>{errorMessage}</FormErrorMessage>
		) : (
			<FormHelperText>{helperText}</FormHelperText>
		)}
	</ChakraFormControl>
);

export default FormControl;
