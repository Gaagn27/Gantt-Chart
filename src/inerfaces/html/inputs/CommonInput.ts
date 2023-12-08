import { BaseInput } from "./BaseInput";

export interface CommonInput extends BaseInput {
	type:
		| "checkbox"
		| "date"
		| "email"
		| "password"
		| "file"
		| "hidden"
		| "number"
		| "radio"
		| "text";
}
