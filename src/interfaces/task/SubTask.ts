import { BaseTask } from "./BaseTask";

export interface SubTask extends BaseTask {
	parentTask: string;
}
