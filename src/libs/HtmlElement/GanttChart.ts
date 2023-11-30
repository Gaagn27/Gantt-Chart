import { Task } from "../../inerfaces/Task";

export abstract class GanttChart {
	protected _tasks: Task[];
	protected readonly _container: HTMLElement;
	constructor(container: HTMLElement, tasks: Task[]) {
		this._tasks = tasks;
		this._container = container;
	}

	abstract renderTaskRows(): void;

	public updateTasks(tasks: Task[]): void {
		this._tasks = tasks;
		this.renderTaskRows();
	}
}
