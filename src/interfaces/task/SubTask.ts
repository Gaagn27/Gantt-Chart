import { BaseTask } from "./BaseTask";

export interface SubTask extends BaseTask {
	parentTask: string;
	[key: string]: SubTask[] | string | number | undefined;
}
