import { GanttChart } from "./GanttChart";
import { createElement } from "./HtmlHelper";
import { Modal } from "./Modal";

export class Sidebar extends GanttChart {
	public renderTasksSidebar(): void {
		const taskHeader = createElement("div", "task-header");
		this._container.appendChild(taskHeader);
		const btn = createElement("button", "addTask", "Add Task");
		btn.addEventListener("click", () => Modal.openModal());
		taskHeader.appendChild(createElement("p", "task-label", "Tasks"));
		taskHeader.appendChild(btn);
		this.renderTaskRows();
	}

	public renderTaskRows(): void {
		this._tasks.forEach((task) => {
			const taskSide = createElement("div", "task-row", task.name);
			taskSide.id = `task-side${task.name}`;
			if (task.uid) {
				taskSide.setAttribute("data-uid", task.uid);
			}
			this._container.appendChild(taskSide);
		});
	}


}
