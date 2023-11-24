import { DateRange } from "./inerfaces/date/DateRange";
import { Task } from "./inerfaces/Task";
import { getEarliestDate, getLatestDate } from "./libs/Date/Date";
import { createElement } from "./libs/HtmlElement/HtmlHelper";

//
// eslint-disable-next-line no-use-before-define
function isTaskDay(date: Date, tasks: Task[]): boolean {
	return tasks.some((task) => {
		const taskStart = new Date(task.start);
		const taskEnd = new Date(task.end);

		return date >= taskStart && date <= taskEnd;
	});
}
// Render calendar
function renderCalendar(containerId: string, tasks: Task[]): void {
	const container = document.getElementById(containerId);
	if (!container) {
		return;
	}

	container.classList.add("container");

	const sideBar = createElement("div", "sidebar");
	container.appendChild(sideBar);

	const mainBox = createElement("div", "mainBox");
	container.appendChild(mainBox);

	// Render row with day numbers
	const dateRange = getDateRange(tasks);
	renderDayHeaders(mainBox, dateRange, true);

	// Render rows highlighting task days
	renderTaskRows(mainBox, tasks, dateRange);
	renderTasksSidebar(sideBar, tasks);
}

function getDateRange(tasks: Task[]): DateRange {
	const earliest = getEarliestDate(tasks);
	const latest = getLatestDate(tasks);

	return {
		start: earliest,
		end: latest,
	};
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
			column.id = `${current.getTime()}`;
		} else {
			column = createElement("div", "day");
		}
		row.appendChild(column);
		current = nextDay(current);
	}

	container.appendChild(row);
}

function renderTaskRows(container: HTMLElement, tasks: Task[], dateRange: DateRange) {
	tasks.forEach((task) => {
		renderDayHeaders(container, dateRange);
	});
}
function renderTasksSidebar(container: HTMLElement, tasks: Task[]) {
	const taskHeader = createElement("div", "task-header", "Tasks");
	container.appendChild(taskHeader);
	tasks.forEach((task) => {
		const taskSide = createElement("div", "task", task.name);
		taskSide.id = `task-side${task.name}`;
		container.appendChild(taskSide);
		const taskBox = createElement("div", "task-box", "");
		taskBox.style.position = "absolute";
		const leftBox = document.getElementById(Date.parse(task.start).toString());
		taskHeader.style.height = `${leftBox?.offsetHeight}px`;
		const leftCords = leftBox?.offsetLeft;
		const rightBox = document.getElementById(Date.parse(task.end).toString())?.offsetLeft;
		if (leftCords && rightBox) {
			taskBox.style.left = `${leftCords}px`;
			taskBox.style.width = `${rightBox - leftCords}px`;
			taskBox.style.top = `${document.getElementById(`task-side${task.name}`)?.offsetTop}px`;
			container.appendChild(taskBox);
		}
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
