import { ChartConfigs } from "../../interfaces/ChartConfigs";
import { SubTask } from "../../interfaces/task/SubTask";
import { Task } from "../../interfaces/task/Task";
import { Validations } from "../validations";
import { Calender } from "./Calender";
import { createElement, removeElements } from "./HtmlHelper";
import { inputValue } from "./InputHelper";
import { Modal } from "./Modal";
import { SelectOptionsHelper } from "./SelectOptionsHelper";
import { Sidebar } from "./Sidebar";

export class RenderCalender {
	private readonly _configs: ChartConfigs;
	private _calendar: Calender | undefined;
	private _sidebar: Sidebar | undefined;
	private _tasks: Task[] = [];
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
		this._tasks = this._configs.tasks;

		container.classList.add("container");

		const sideBarEl = createElement("div", "sidebar");
		sideBarEl.id = "sidebar";
		container.appendChild(sideBarEl);

		const mainBox = createElement("div", "mainBox");
		container.appendChild(mainBox);
		mainBox.id = "mainBox";
		// Render row with day numbers
		this._calendar = new Calender(mainBox, this._tasks);
		this._sidebar = new Sidebar(sideBarEl, this._tasks);
		this._calendar.renderCalender();
		this._sidebar.renderTasksSidebar();
		this._setTaskOptions();
		Modal.renderModal(this._configs.modalConfigs);
		this._addTask();
	}

	private _setTaskOptions() {
		const inputs = this._configs.modalConfigs.inputs;

		const taskOptions = this._tasks
			.filter((task) => task.uid)
			.map((task) => ({ label: task.name, value: task.uid }));
		new SelectOptionsHelper(inputs).setTasksInputs("parentTask", taskOptions);
		new SelectOptionsHelper(inputs).setTasksInputs("successor", taskOptions);
		new SelectOptionsHelper(inputs).setTasksInputs("predecessor", taskOptions);
	}

	private _validate(task: Task): boolean {
		const inputs = this._configs.modalConfigs.inputs;

		removeElements(document.querySelectorAll("span.error"));
		const validation = new Validations(task, inputs);
		validation.errors().forEach((error) => {
			const errorMessage = error.messages;
			const errorEl = createElement("span", "error", errorMessage.join());
			const inputEl = document.querySelector(`[name='${error.field}']`) as HTMLElement;
			if (inputEl.parentNode) {
				inputEl.parentNode.appendChild(errorEl);
			}
		});

		return validation.errors().length === 0;
	}

	private _addTask() {
		const addTask = document.getElementById("addTask");
		if (addTask) {
			addTask.addEventListener("click", () => {
				const task: Task = {
					name: inputValue("name") ?? "",
					start: inputValue("start") ?? "",
					end: inputValue("end") ?? "",
					parentTask: inputValue("parentTask") ?? "",
					completion: inputValue("completion") ?? "",
					uid: this.generateRandomId(),
				};

				if (this._validate(task)) {
					removeElements(document.querySelectorAll(".task-row"));
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
							this._configs.tasks[parentTaskIndex].subTasks = parentTask.subTasks?.map(
								(taskObj: SubTask) => {
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
					if (this._calendar) {
						this._calendar.updateTasks(this._configs.tasks);
					}
					if (this._sidebar) {
						this._sidebar.updateTasks(this._configs.tasks);
					}

					Modal.closeModal();
					this._setTaskOptions();
					const form = document.querySelector("form#taskForm") as HTMLFormElement;
					form.reset();
					if (this._configs.modalConfigs.addTask) {
						this._configs.modalConfigs.addTask(task);
					}
					if (this._configs.modalConfigs.updateTask) {
						this._configs.modalConfigs.updateTask(task);
					}
				}
			});
		}
	}
}
