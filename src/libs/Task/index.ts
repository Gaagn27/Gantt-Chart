import { Task as TaskInterface } from "../../inerfaces/Task";
import { createElement } from "../HtmlElement/HtmlHelper";
import { Modal } from "../HtmlElement/Modal";

export class Task {
	// private readonly _tasks: TaskInterface;
	// constructor(tasks: TaskInterface) {
	// 	this._tasks = tasks;
	// }

	public edit(task: TaskInterface): void {
		const form = document.getElementById("taskForm") as HTMLFormElement;
		const uidEl = createElement("input", "form-input") as HTMLFormElement;
		uidEl.value = task.uid;

		uidEl.setAttribute("name", "_uid");
		uidEl.setAttribute("type", "hidden");
		form.appendChild(uidEl);
		for (const taskKey in task) {
			const input = form.elements.namedItem(taskKey);
			if (input && typeof task[taskKey] === "string") {
				(input as HTMLInputElement).value = <string>task[taskKey];
			}
		}
		Modal.openModal();
	}
}
