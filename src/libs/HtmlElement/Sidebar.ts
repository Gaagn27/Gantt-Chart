import { SubTask } from "../../interfaces/task/SubTask";
import { Task as TaskInterface } from "../../interfaces/task/Task";
import { Task } from "../Task";
import { GanttChart } from "./GanttChart";
import { createElement } from "./HtmlHelper";
import { Modal } from "./Modal";
import { TaskSelect } from "./Select/TaskSelect";

export class Sidebar extends GanttChart {
	public renderTasksSidebar(): void {
		const taskHeader = createElement("div", "task-header");
		this._container.appendChild(taskHeader);
		const btn = createElement("button", "addTask", "Add Task");
		btn.addEventListener("click", () => {
			const form = document.querySelector("form#taskForm") as HTMLFormElement;
			form.reset();
			const task = document.querySelector("[name='parentTask']") as HTMLSelectElement;
			new TaskSelect(this._inputs, this._tasks).updatePredecessorSuccessor(task.value);
			Modal.openModal();
		});

		taskHeader.appendChild(createElement("p", "task-label", "Tasks"));
		taskHeader.appendChild(btn);
		this.renderTaskRows();
	}

	public renderTaskRows(): void {
		this._tasks.forEach((task: TaskInterface) => {
			const taskElement = this.createTaskElement(task);
			this._container.appendChild(taskElement);

			if (task.subTasks) {
				task.subTasks.forEach((subTask: SubTask) => {
					const subTaskElement = this.createTaskElement(subTask, true);
					this._container.appendChild(subTaskElement);
				});
			}
		});
	}

	private createTaskElement(task: TaskInterface | SubTask, isSubTask = false) {
		const element = createElement("div", "task-row", task.name);

		if (task.uid) {
			element.id = `task-side-${<string>task.uid}`;
			element.setAttribute("data-uid", <string>task.uid);
		}

		if (isSubTask) {
			element.innerHTML = `<p>${task.name}</p>`;
			element.classList.add("sub-task-side");
		}

		element.addEventListener("click", () => {
			new TaskSelect(this._inputs, this._tasks).updatePredecessorSuccessor(<string>task.parentTask);
			new Task().edit(task);
		});

		return element;
	}
}
