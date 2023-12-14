import { BaseTask } from "./BaseTask";
import { SubTask } from "./SubTask";

export interface Task extends BaseTask {
	[key: string]: SubTask[] | string | number | undefined;
	subTasks?: SubTask[];
}
