import { DateRange } from "./inerfaces/date/DateRange";
import { Task } from "./inerfaces/Task";
import { getDateRange } from "./libs/Date/Date";
import { createElement, getElementFullWidth } from "./libs/HtmlElement/HtmlHelper";

//
// eslint-disable-next-line no-use-before-define
function isTaskDay(date: Date, tasks: Task[]): boolean {
	return tasks.some((task) => {
		const taskStart = new Date(task.start);
		const taskEnd = new Date(task.end);

		return date >= taskStart && date <= taskEnd;
	});
}
function openModal(): void {
	const modal: HTMLElement = createElement("div", "modal");
	modal.id = "modal";
	const modalHeader: HTMLElement = createElement("div", "modal-header");
	const modalBody: HTMLElement = createElement("div", "modal-body");
	const modalFooter: HTMLElement = createElement("div", "modal-footer");
	const modalHeaderLabel: HTMLElement = createElement("div", "modal-title", "this id modal");
	const closeButton: HTMLElement = createElement("span", "close", "X");
	const save: HTMLElement = createElement("button", "btn", "save");
	closeButton.innerHTML = "&times;";
	modal.appendChild(modalHeader);
	modalHeader.appendChild(modalHeaderLabel);
	modalHeader.appendChild(closeButton);
	modal.appendChild(modalBody);
	modalFooter.appendChild(save);
	modal.appendChild(modalFooter);
	document.body.appendChild(modal);

	const overlay: HTMLElement = createElement("div", "overlay");
	overlay.id = "overlay";
	document.body.appendChild(overlay);
	modal.style.display = "block";
	overlay.style.display = "block";

	overlay.addEventListener("click", closeModal);
	closeButton.addEventListener("click", closeModal);
}

function closeModal() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	document.getElementById("modal").remove();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	document.getElementById("overlay").remove();
}
// Render calendar
function renderCalendar(containerId: string, tasks: Task[]): void {
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
	const dateRange = getDateRange(tasks);
	renderDayHeaders(mainBox, dateRange, true);
	// Render rows highlighting task days
	renderTaskRows(mainBox, tasks);
	renderTasksSidebar(sideBar, tasks);
	drawLine(mainBox);
}

function renderDayHeaders(
	container: HTMLElement,
	{ start, end }: DateRange,
	isHeader = false
): void {
	const row = createElement("div", "row");

	let current: Date = start;
	while (current <= end) {
		let column;
		if (isHeader) {
			column = createElement(
				"div",
				"day",
				`${current.getFullYear()}-${current.getMonth()}-${current.getDate().toString()}`
			);
			row.id = "dateHeader";
			column.id = `${current.getTime()}`;
		} else {
			column = createElement("div", "day");
		}
		row.appendChild(column);
		current = nextDay(current);
	}
	container.appendChild(row);
}
function drawLine(container: HTMLElement) {
	const canvas = createElement("div", "column-lines-canvas");
	canvas.style.width = `${String(getElementFullWidth(container))}px`;
	// Get all elements with the class name 'day' within the 'dateHeader' ID
	const dayElements = document.querySelectorAll("#dateHeader .day");
	// Loop through each 'day' element
	dayElements.forEach((dayElement) => {
		const line = createElement("div", "column-line");
		const day = document.getElementById(dayElement.id);
		if (day) {
			line.style.transform = `translateX(${day.offsetLeft}px)`;
			line.style.color = `red`;
		}
		// console.log(line)
		canvas.appendChild(line);
	});
	container.appendChild(canvas);
	const sidebar = document.getElementById("sidebar");
	container.style.height = "100%";
}
function renderTaskRows(container: HTMLElement, tasks: Task[]) {
	tasks.forEach((task) => {
		const row = createElement("div", "task-row");
		const taskBox = createElement("div", "task-box", "");

		row.style.width = `${String(getElementFullWidth(container))}px`;
		taskBox.style.position = "absolute";
		const tooltip = createElement("div", "task-box-text");
		tooltip.innerHTML = `<h6>${task.name}</h2>
							<span><strong>Start</strong> ${task.start}</span>
							<span><strong>End</strong> ${task.end}</span>`;
		taskBox.appendChild(tooltip);
		const leftBox = document.getElementById(Date.parse(task.start).toString());
		const leftCords = leftBox?.offsetLeft;
		const rightBox = document.getElementById(Date.parse(task.end).toString())?.offsetLeft;
		// eslint-disable-next-line eqeqeq
		if (leftCords != null && rightBox != null) {
			taskBox.style.left = `${leftCords}px`;
			taskBox.style.width = `${rightBox - leftCords + 50}px`;
			taskBox.style.top = `${document.getElementById(`task-side${task.name}`)?.offsetTop}px`;
			row.appendChild(taskBox);
		}
		container.appendChild(row);
	});
}

//  {
// }
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
renderCalendar("renderCalendar", [
	{ name: "Task 1", start: "2023-11-01", end: "2023-11-05" },
	{ name: "Task 2", start: "2023-11-03", end: "2023-12-08" },
]);
