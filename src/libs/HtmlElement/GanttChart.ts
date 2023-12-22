import { Task } from "../../interfaces/task/Task";
import { InputTypes } from "../../types/Inputs/InputTypes";

export abstract class GanttChart {
	protected _tasks: Task[];
	protected readonly _container: HTMLElement;
	protected _inputs: InputTypes[];
	constructor(container: HTMLElement, tasks: Task[], inputs: InputTypes[]) {
		this._tasks = tasks;
		this._container = container;
		this._inputs = inputs;
	}

	abstract renderTaskRows(): void;

	public updateTasks(tasks: Task[]): void {
		this._tasks = tasks;
		this.renderTaskRows();
	}
}
