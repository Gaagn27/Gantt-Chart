import { Input } from "./html/Input";
import { Task } from "./Task";

export interface ChartConfigs {
	id: string;
	tasks: Array<Task>;
	formConfigs: Array<Input>;
}
