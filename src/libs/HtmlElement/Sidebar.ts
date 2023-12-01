import { Task } from "../Task";
import { GanttChart } from "./GanttChart";
import { createElement } from "./HtmlHelper";
import { Modal } from "./Modal";

export class Sidebar extends GanttChart {
	public renderTasksSidebar(): void {
		const taskHeader = createElement("div", "task-header");
		this._container.appendChild(taskHeader);
		const btn = createElement("button", "addTask", "Add Task");
		btn.addEventListener("click", () => {
			const form = document.querySelector("form#taskForm") as HTMLFormElement;
			form.reset();
			Modal.openModal();
		});

		taskHeader.appendChild(createElement("p", "task-label", "Tasks"));
		taskHeader.appendChild(btn);
		this.renderTaskRows();
	}

	public renderTaskRows(): void {
		this._tasks.forEach((task) => {
			const taskSide = createElement("div", "task-row", task.name);
			if (task.uid) {
				taskSide.id = `task-side-${task.uid}`;
				taskSide.setAttribute("data-uid", task.uid);
			}
			taskSide.addEventListener("click", () => new Task().edit(task));
			this._container.appendChild(taskSide);
		});
	}
}
