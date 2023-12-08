import { ModalConfigs } from "./html/ModalConfigs";
import { Task } from "./Task";

export interface ChartConfigs {
	id: string;
	tasks: Array<Task>;
	modalConfigs: ModalConfigs;
}
