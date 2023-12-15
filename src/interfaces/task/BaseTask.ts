import { SubTask } from "./SubTask";

export interface BaseTask {
	name: string;
	start: string;
	end: string;
	completion: number | string;
	[key: string]: SubTask[] | string | number | undefined;
}
