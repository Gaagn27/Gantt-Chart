import { BaseInput } from "../../interfaces/html/inputs/BaseInput";
import { SelectOption } from "../../interfaces/html/inputs/SelectOption";

type SelectInput = Omit<BaseInput, "type"> & {
	type: "select";
	options: string[] | SelectOption[];
};

type TextInput = Omit<BaseInput, "options"> & {
	type: "text";
};
type DateInput = Omit<BaseInput, "options"> & {
	type: "date";
};
type TextAreaInput = Omit<BaseInput, "options"> & {
	type: "textarea";
};

export type InputTypes = SelectInput | TextInput | TextAreaInput | DateInput;
