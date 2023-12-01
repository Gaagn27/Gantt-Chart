import { Task as TaskInterface } from "../../inerfaces/Task";
import { createInputElement } from "../HtmlElement/InputHelper";
import { Modal } from "../HtmlElement/Modal";

export class Task {
	// private readonly _tasks: TaskInterface;
	// constructor(tasks: TaskInterface) {
	// 	this._tasks = tasks;
	// }

	public edit(task: TaskInterface): void {
		const form = document.getElementById("taskForm") as HTMLFormElement;
		form.appendChild(
			createInputElement({
				name: "uid",
				type: "hidden",
				value: task.uid,
			})
		);
		for (const taskKey in task) {
			const input = form.elements.namedItem(taskKey);
			if (input) {
				(input as HTMLInputElement).value = task[taskKey];
			}
		}
		Modal.openModal();
	}
}
