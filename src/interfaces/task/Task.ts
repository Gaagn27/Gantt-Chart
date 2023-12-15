import { BaseTask } from "./BaseTask";
import { SubTask } from "./SubTask";

export interface Task extends BaseTask {
	subTasks?: SubTask[];
}
