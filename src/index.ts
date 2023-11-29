import { ChartConfigs } from "./inerfaces/ChartConfigs";
import { ModalConfigs } from "./inerfaces/html/ModalConfigs";
import { Task } from "./inerfaces/Task";
import { Calender } from "./libs/HtmlElement/Calender";
import { createElement } from "./libs/HtmlElement/HtmlHelper";
import { createInputElement } from "./libs/HtmlElement/InputHelper";

//
// eslint-disable-next-line no-use-before-define
function isTaskDay(date: Date, tasks: Task[]): boolean {
	return tasks.some((task) => {
		const taskStart = new Date(task.start);
		const taskEnd = new Date(task.end);

		return date >= taskStart && date <= taskEnd;
	});
}
function renderModal(configs: ModalConfigs) {
	const modal: HTMLElement = createElement("div", "modal");
	modal.id = "modal";
	const modalHeader: HTMLElement = createElement("div", "modal-header");
	const modalBody: HTMLElement = createElement("div", "modal-body");
	const modalFooter: HTMLElement = createElement("div", "modal-footer");
	const modalHeaderLabel: HTMLElement = createElement("div", "modal-title", "this id modal");
	const closeButton: HTMLElement = createElement("span", "close", "X");
	const save: HTMLElement = createElement("button", "btn", "Add Task");
	save.id = "addTask";
	closeButton.innerHTML = "&times;";
	modal.appendChild(modalHeader);
	modalHeader.appendChild(modalHeaderLabel);
	modalHeader.appendChild(closeButton);
	modal.appendChild(modalBody);
	modalFooter.appendChild(save);
	modal.appendChild(modalFooter);
	document.body.appendChild(modal);
	const elements = configs.inputs;
	elements.forEach((element) => {
		modalBody.appendChild(createInputElement(element));
	});
	const overlay: HTMLElement = createElement("div", "overlay");
	overlay.id = "overlay";
	document.body.appendChild(overlay);
	overlay.addEventListener("click", closeModal);
	closeButton.addEventListener("click", closeModal);
}
function openModal(): void {
	const modal = document.getElementById("modal");
	const overlay = document.getElementById("overlay");
	if (modal) {
		modal.style.display = "block";
	}
	if (overlay) {
		overlay.style.display = "block";
	}
}

function closeModal() {
	const modal = document.getElementById("modal");
	const overlay = document.getElementById("overlay");
	if (modal) {
		modal.style.display = "none";
	}
	if (overlay) {
		overlay.style.display = "none";
	}
}
// Render calendar
let rendered = false;
function renderCalendar(configs: ChartConfigs): void {
	if (rendered) {
		return;
	}

	rendered = true;
	const containerId: string = configs.id;
	// emptyChildElements(containerId);
	const tasks: Task[] = configs.tasks;
	const container = document.getElementById(containerId);
	if (!container) {
		return;
	}

	container.classList.add("container");

	const sideBar = createElement("div", "sidebar");
	sideBar.id = "sidebar";
	container.appendChild(sideBar);

	const mainBox = createElement("div", "mainBox");
	container.appendChild(mainBox);
	mainBox.id = "mainBox";
	// Render row with day numbers
	const calendar: Calender = new Calender(mainBox, tasks);
	calendar.renderDayHeaders();
	calendar.renderTaskRows();
	calendar.drawLine();
	renderTasksSidebar(sideBar, tasks);

	renderModal(configs.modalConfigs);
	const addTask = document.getElementById("addTask");
	if (addTask) {
		addTask.addEventListener("click", () => {
			const elementsToRemove = document.querySelectorAll(".task-row");

			elementsToRemove.forEach((element) => {
				element.remove();
			});
			const mainBox = document.getElementById("mainBox");
			configs.tasks.push({ name: "Task 3", start: "2023-11-06", end: "2023-12-01" });
			console.log(configs.tasks);
			calendar.updateTasks(configs.tasks);
			if (mainBox) {
				// if (configs.addTask) {
				// 	configs.addTask({ name: "Task 3", start: "2023-10-06", end: "2023-11-01" });
				// }
			}
		});
	}
}

function renderTasksSidebar(container: HTMLElement, tasks: Task[]) {
	const taskHeader = createElement("div", "task-header");
	container.appendChild(taskHeader);
	const btn = createElement("button", "addTask", "Add Task");
	btn.addEventListener("click", openModal);
	taskHeader.appendChild(createElement("p", "task-label", "Tasks"));
	taskHeader.appendChild(btn);
	tasks.forEach((task) => {
		const taskSide = createElement("div", "task-row", task.name);
		taskSide.id = `task-side${task.name}`;
		container.appendChild(taskSide);
	});
}

function nextDay(date: Date): Date {
	const next = new Date(date);
	next.setDate(date.getDate() + 1);

	return next;
}
const tasks = [
	{ name: "Task 1", start: "2023-11-01", end: "2023-11-05" },
	{ name: "Task 2", start: "2023-11-03", end: "2023-12-08" },
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
				class: "Project",
			},
			{
				name: "start",
				type: "date",
				label: "Project Start Date",
				class: "Project",
			},
			{
				name: "end",
				type: "date",
				label: "Project End Date",
				class: "Project",
			},
		],
	},
});
function addTask(task: Task) {
	// tasks.push(task);
}
