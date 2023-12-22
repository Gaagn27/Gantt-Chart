import { SubTask } from "../../../interfaces/task/SubTask";
import { Task } from "../../../interfaces/task/Task";
import { InputTypes } from "../../../types/Inputs/InputTypes";
import { SelectOptionsHelper } from "./SelectOptionsHelper";

export class TaskSelect {
	private readonly _tasks: Task[];
	private readonly _inputs: InputTypes[];

	constructor(inputs: InputTypes[], tasks: Task[]) {
		this._inputs = inputs;
		this._tasks = tasks;
	}

	public updatePredecessorSuccessor(parentTask: string | false = false): void {
		if (parentTask) {
			const parentObj = this._tasks.find((task: Task | SubTask) => task.uid === parentTask);
			if (parentObj && parentObj.subTasks) {
				this._setPredecessorSuccessor(
					parentObj.subTasks
						.filter((task) => task.uid)
						.map((task) => ({ label: task.name, value: task.uid }))
				);
			} else {
				this._setPredecessorSuccessor([]);
			}
		} else {
			this._setTaskOptions();
		}
	}

	private _setTaskOptions() {
		const taskOptions = this._tasks
			.filter((task) => task.uid)
			.map((task) => ({ label: task.name, value: task.uid }));
		new SelectOptionsHelper(this._inputs).setTasksInputs("parentTask", taskOptions);
		this._setPredecessorSuccessor(taskOptions);
	}

	private _setPredecessorSuccessor(tasks: { label: string; value: string | undefined }[]) {
		new SelectOptionsHelper(this._inputs).setTasksInputs("successor", tasks);
		new SelectOptionsHelper(this._inputs).setTasksInputs("predecessor", tasks);
	}
}