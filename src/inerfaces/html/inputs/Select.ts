import { BaseInput } from "./BaseInput";

export interface Select extends BaseInput {
	type: "select";
	options: unknown[];
}
