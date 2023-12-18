import { ChartConfigs } from "../../interfaces/ChartConfigs";
import { SubTask } from "../../interfaces/task/SubTask";
import { Task } from "../../interfaces/task/Task";
import { Validations } from "../validations";
import { Calender } from "./Calender";
import { createElement } from "./HtmlHelper";
import { inputValue } from "./InputHelper";
import { Modal } from "./Modal";
import { SelectOptionsHelper } from "./SelectOptionsHelper";
import { Sidebar } from "./Sidebar";

export class RenderCalender {
	private readonly _configs: ChartConfigs;
	constructor(config: ChartConfigs) {
		this._configs = config;
	}

	public generateRandomId(length = 16): string {
		const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let id = "";

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * alphanumeric.length);
			id += alphanumeric.charAt(randomIndex);
		}

		return id;
	}

	public renderCalendar(): void {
		const containerId: string = this._configs.id;
		const container = document.getElementById(containerId);
		if (!container) {
			return;
		}
		this._configs.tasks.map((task) => {
			task.uid = task.uid ?? this.generateRandomId();

			return task;
		});
		const tasks: Task[] = this._configs.tasks;

		container.classList.add("container");

		const sideBarEl = createElement("div", "sidebar");
		sideBarEl.id = "sidebar";
		container.appendChild(sideBarEl);

		const mainBox = createElement("div", "mainBox");
		container.appendChild(mainBox);
		mainBox.id = "mainBox";
		// Render row with day numbers
		const calendar: Calender = new Calender(mainBox, tasks);
		const sidebar: Sidebar = new Sidebar(sideBarEl, tasks);
		calendar.renderCalender();
		sidebar.renderTasksSidebar();
		const inputs = this._configs.modalConfigs.inputs;
		// setTasksInputs(inputs, tasks);
		const taskOptions = tasks
			.filter((task) => task.uid)
			.map((task) => ({ label: task.name, value: task.uid }));
		new SelectOptionsHelper(inputs).setTasksInputs("parentTask", taskOptions);
		new SelectOptionsHelper(inputs).setTasksInputs("successor", taskOptions);
		new SelectOptionsHelper(inputs).setTasksInputs("predecessor", taskOptions);
		Modal.renderModal(this._configs.modalConfigs);
		const addTask = document.getElementById("addTask");
		if (addTask) {
			addTask.addEventListener("click", () => {
				const mainBox = document.getElementById("mainBox");
				const task: Task = {
					name: inputValue("name") ?? "",
					start: inputValue("start") ?? "",
					end: inputValue("end") ?? "",
					parentTask: inputValue("parentTask") ?? "",
					completion: inputValue("completion") ?? "",
					uid: this.generateRandomId(),
				};
				document.querySelectorAll("span.error").forEach((element) => {
					element.remove();
				});
				const validation = new Validations(task, inputs);
				validation.errors().forEach((error) => {
					const errorMessage = error.messages;
					const errorEl = createElement("span", "error", errorMessage.join());
					const inputEl = document.querySelector(`[name='${error.field}']`) as HTMLElement;
					if (inputEl.parentNode) {
						inputEl.parentNode.appendChild(errorEl);
					}
				});
				if (validation.errors().length === 0) {
					const elementsToRemove = document.querySelectorAll(".task-row");
					elementsToRemove.forEach((element) => {
						element.remove();
					});
					const uid = document.querySelector("input[name='_uid']") as HTMLInputElement | undefined;
					if (!task.parentTask) {
						if (uid) {
							this._configs.tasks = this._configs.tasks.map((taskObj) => {
								if (taskObj.uid === uid.value) {
									return { ...taskObj, ...task };
								}

								return taskObj;
							});
						} else {
							this._configs.tasks.push(task);
						}
					} else {
						const parentTaskIndex = this._configs.tasks.findIndex(
							(taskObj) => taskObj.uid === task.parentTask
						);
						const parentTask = this._configs.tasks[parentTaskIndex];
						if (uid) {
							this._configs.tasks[parentTaskIndex].subTasks = parentTask.subTasks?.map((taskObj: SubTask) => {
									if (taskObj.uid === uid.value) {
										return { ...taskObj, ...task };
									}

									return taskObj;
								}
							);
						} else if (parentTask.subTasks) {
							parentTask.subTasks.push(<SubTask>task);
						} else {
							parentTask["subTasks"] = [];
							parentTask.subTasks.push(<SubTask>task);
						}
					}

					calendar.updateTasks(this._configs.tasks);
					sidebar.updateTasks(this._configs.tasks);

					Modal.closeModal();
					const taskOptions = tasks
						.filter((task) => task.uid)
						.map((task) => ({ label: task.name, value: task.uid }));
					new SelectOptionsHelper(inputs).setTasksInputs("parentTask", taskOptions);
					new SelectOptionsHelper(inputs).setTasksInputs("successor", taskOptions);
					new SelectOptionsHelper(inputs).setTasksInputs("predecessor", taskOptions);
					const form = document.querySelector("form#taskForm") as HTMLFormElement;
					form.reset();
					if (mainBox) {
						if (this._configs.modalConfigs.addTask) {
							this._configs.modalConfigs.addTask(task);
						}
						if (this._configs.modalConfigs.updateTask) {
							this._configs.modalConfigs.updateTask(task);
						}
					}
				}
			});
		}
	}
}
