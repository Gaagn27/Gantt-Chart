export interface SubTask {
	name: string;
	start: string;
	end: string;
	parentTask: string;
	[key: string]: SubTask[] | string | undefined;
}
