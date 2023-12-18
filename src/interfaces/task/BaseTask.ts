import { SubTask } from "./SubTask";

export interface BaseTask {
	name: string;
	start: string;
	end: string;
	uid?: string;
	completion: number | string;
	[key: string]: SubTask[] | string[] | string | number | undefined;
	successor?: string[];
	predecessor?: string[];
}
