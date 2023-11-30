import { ChartConfigs } from "./inerfaces/ChartConfigs";
import { Task } from "./inerfaces/Task";
import { Calender } from "./libs/HtmlElement/Calender";
import { createElement } from "./libs/HtmlElement/HtmlHelper";
import { inputValue } from "./libs/HtmlElement/InputHelper";
import { Modal } from "./libs/HtmlElement/Modal";
import { Sidebar } from "./libs/HtmlElement/Sidebar";

//
// eslint-disable-next-line no-use-before-define
function isTaskDay(date: Date, tasks: Task[]): boolean {
	return tasks.some((task) => {
		const taskStart = new Date(task.start);
		const taskEnd = new Date(task.end);

		return date >= taskStart && date <= taskEnd;
	});
}
function generateRandomId(length=16): string {
	const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let id = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * alphanumeric.length);
		id += alphanumeric.charAt(randomIndex);
	}

	return id;
}
// Render calendar
function renderCalendar(configs: ChartConfigs): void {
	const containerId: string = configs.id;
	configs.tasks.map((task) => (task.uid = generateRandomId()));
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
	calendar.renderDayHeaders();
	calendar.renderTaskRows();
	calendar.drawLine();
	sidebar.renderTasksSidebar();

	Modal.renderModal(configs.modalConfigs);
	const addTask = document.getElementById("addTask");
	if (addTask) {
		addTask.addEventListener("click", () => {
			const elementsToRemove = document.querySelectorAll(".task-row");

			elementsToRemove.forEach((element) => {
				element.remove();
			});
			const mainBox = document.getElementById("mainBox");
			const task: Task = {
				name: inputValue("name") ?? "",
				start: inputValue("start") ?? "",
				end: inputValue("end") ?? "",
				uid: generateRandomId(),
			};
			configs.tasks.push(task);
			calendar.updateTasks(configs.tasks);
			sidebar.updateTasks(configs.tasks);
			if (mainBox) {
				if (configs.modalConfigs.addTask) {
					configs.modalConfigs.addTask(task);
				}
			}
		});
	}
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
	console.log(task);
}
