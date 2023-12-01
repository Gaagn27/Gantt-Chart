import { Task } from "../Task";
import { Input } from "./Input";

type AddTask = (task: Task) => void;

export interface ModalConfigs {
	inputs: Array<Input>;
	addTask?: AddTask;
	updateTask?: AddTask;
}
