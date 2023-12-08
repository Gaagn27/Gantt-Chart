export interface Input {
	name: string;
	type: string;
	[key: string]: string | number | boolean | unknown;
	options?: unknown[];
}
