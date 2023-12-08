import { SubTask } from "./SubTask";

export interface Task {
	name: string;
	start: string;
	end: string;
	[key: string]: SubTask[] | string | undefined;
	subTasks?: SubTask[];
}
