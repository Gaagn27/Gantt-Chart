import "../src/sass/main.scss";

import { ChartConfigs } from "./interfaces/ChartConfigs";
import { SubTask } from "./interfaces/task/SubTask";
import { Task } from "./interfaces/task/Task";
import { Calender } from "./libs/HtmlElement/Calender";
import { createElement } from "./libs/HtmlElement/HtmlHelper";
import { InputHelper, inputValue } from "./libs/HtmlElement/InputHelper";
import { Modal } from "./libs/HtmlElement/Modal";
import { Sidebar } from "./libs/HtmlElement/Sidebar";
import { Validations } from "./libs/validations";
import { InputTypes } from "./types/Inputs/InputTypes";

// eslint-disable-next-line no-use-before-define
function isTaskDay(date: Date, tasks: Task[]): boolean {
	return tasks.some((task) => {
		const taskStart = new Date(task.start);
		const taskEnd = new Date(task.end);

		return date >= taskStart && date <= taskEnd;
	});
}
function generateRandomId(length = 16): string {
	const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let id = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * alphanumeric.length);
		id += alphanumeric.charAt(randomIndex);
	}

	return id;
}
function setTasksInputs(inputs: InputTypes[], tasks: Task[]) {
	inputs.map((input) => {
		if (input.name === "parentTask") {
			input.options = tasks.map((task) => ({ label: task.name, value: task.uid }));
		}

		return input;
	});
	const taskSelect: InputTypes | undefined = inputs.find((input) => input.name === "task");
	if (taskSelect) {
		const select = new InputHelper(taskSelect);
		select.updateSelectOptions();
	}
}
// Render calendar
function renderCalendar(configs: ChartConfigs): void {
	const containerId: string = configs.id;
	configs.tasks.map((task) => {
		task.uid = task.uid ?? generateRandomId();

		return task;
	});
	const tasks: Task[] = configs.tasks;
	const container = document.getElementById(containerId);
	if (!container) {
		return;
	}
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
	const inputs = configs.modalConfigs.inputs;
	setTasksInputs(inputs, tasks);
	Modal.renderModal(configs.modalConfigs);
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
				uid: generateRandomId(),
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
						configs.tasks = configs.tasks.map((taskObj) => {
							if (taskObj.uid === uid.value) {
								return { ...taskObj, ...task };
							}

							return taskObj;
						});
					} else {
						configs.tasks.push(task);
					}
				} else {
					const parentTaskIndex = configs.tasks.findIndex(
						(taskObj) => taskObj.uid === task.parentTask
					);
					const parentTask = configs.tasks[parentTaskIndex];
					if (uid) {
						configs.tasks[parentTaskIndex].subTasks = parentTask.subTasks?.map((taskObj: SubTask) => {
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

				calendar.updateTasks(configs.tasks);
				sidebar.updateTasks(configs.tasks);

				Modal.closeModal();
				setTasksInputs(inputs, configs.tasks);
				const form = document.querySelector("form#taskForm") as HTMLFormElement;
				form.reset();
				if (mainBox) {
					if (configs.modalConfigs.addTask) {
						configs.modalConfigs.addTask(task);
					}
					if (configs.modalConfigs.updateTask) {
						configs.modalConfigs.updateTask(task);
					}
				}
			}
		});
	}
}

// Get the current date
const currentDate = new Date();

// Get the start of the current month
const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);

// Get the end of the current month
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

// Format dates in ISO format (YYYY-MM-DD)
const start = startOfMonth.toISOString().slice(0, 10);
const end = endOfMonth.toISOString().slice(0, 10);
const tasks = [
	{
		name: "Parent Task 1",
		start,
		end,
		completion: 10,
		uid: "rsa",
		subTasks: [
			{
				name: "sub task 1",
				start: "2023-12-03",
				end: "2023-12-08",
				parentTask: "rsa",
				uid: "qee",
				completion: 20,
			},
			{
				name: "sub task 3",
				start: "2023-12-04",
				end: "2023-12-08",
				parentTask: "rsa",
				uid: "qee",
				completion: 30,
			},
			{
				name: "sub task 5",
				start: "2023-12-13",
				end: "2023-12-18",
				parentTask: "rsa",
				uid: "qee",
				completion: 10,
			},
		],
	},
	{
		name: "Parent Task 2",
		start: "2023-12-07",
		end: "2024-01-03",
		uid: "ss",
		completion: 0,
	},
];
renderCalendar({
	id: "renderCalendar",
	tasks,
	modalConfigs: {
		addTask,
		inputs: [
			{
				name: "name",
				type: "text",
				label: "Project Name",
				placeholder: "Project Name",
				validations: ["required", "min:3"],
				class: "Project",
			},
			{
				name: "start",
				type: "date",
				label: "Project Start Date",
				class: "Project",
				validations: ["required","date:end,<"],
			},
			{
				name: "end",
				type: "date",
				label: "Project End Date",
				class: "Project",
				validations: ["required","date:start,>"],
			},
			{
				name: "completion",
				type: "number",
				label: "Project Completion",
				minimum: 0,
				maximum: 100,
				class: "Project",
				validations: ["required"],
			},
			{
				name: "parentTask",
				type: "select",
				options: [
					{ label: "test", value: "test" },
					{ label: "disable", value: "disabled", disabled: true },
				],
				label: "Tasks",
			},
		],
	},
});
function addTask(task: Task) {
	console.log(task, "for user");
}
