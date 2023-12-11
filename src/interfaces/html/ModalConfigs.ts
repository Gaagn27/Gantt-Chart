import { InputTypes } from "../../types/Inputs/InputTypes";
import { Task } from "../Task";

type AddTask = (task: Task) => void;

export interface ModalConfigs {
	inputs: Array<InputTypes>;
	addTask?: AddTask;
	updateTask?: AddTask;
}
