import { Task } from "../../inerfaces/Task";
import { GanttChart } from "./GanttChart";
import { createElement } from "./HtmlHelper";
import { Modal } from "./Modal";

export class Sidebar extends GanttChart {
	public renderTasksSidebar(): void {
		const taskHeader = createElement("div", "task-header");
		this._container.appendChild(taskHeader);
		const btn = createElement("button", "addTask", "Add Task");
		btn.addEventListener("click", () => {
			const form = document.querySelector("form#taskForm") as HTMLFormElement | null;
			if (form) {
				form.reset();
			}
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
			taskSide.addEventListener("click", () => {
				const form = document.getElementById("taskForm") as HTMLFormElement;

				for (const taskKey in task) {
					const input = form.elements.namedItem(taskKey);
					if (input) {
						(input as HTMLInputElement).value = task[taskKey];
					}
				}
				Modal.openModal();
			});
			this._container.appendChild(taskSide);
		});
	}
}
