import { ModalConfigs } from "./html/ModalConfigs";
import { Task } from "./task/Task";

export interface ChartConfigs {
	id: string;
	tasks: Array<Task>;
	modalConfigs: ModalConfigs;
}
