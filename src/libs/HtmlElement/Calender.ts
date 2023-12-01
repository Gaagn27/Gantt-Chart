import { getDateRange, nextDay } from "../Date/Date";
import { Task } from "../Task";
import { GanttChart } from "./GanttChart";
import { createElement, getElementFullWidth } from "./HtmlHelper";

export class Calender extends GanttChart {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

	public renderDayHeaders(): void {
		const row = createElement("div", "row");
		const { start, end } = getDateRange(this._tasks);
		let current: Date = start;
		while (current <= end) {
			const column = createElement(
				"div",
				"day",
				`${current.getFullYear()}\n${current.toLocaleString("en", { month: "short" })}\n${current
					.getDate()
					.toString()}`
			);

			row.id = "dateHeader";
			column.id = `${current.getTime()}`;

			row.appendChild(column);
			current = nextDay(current);
		}

		this._container.appendChild(row);
	}

	public drawLine(): void {
		const canvas = createElement("div", "column-lines-canvas");
		canvas.style.width = `${String(getElementFullWidth(this._container))}px`;
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
			canvas.appendChild(line);
		});
		this._container.appendChild(canvas);
		this._container.style.height = "100%";
	}

	public renderTaskRows(): void {
		this._tasks.forEach((task) => {
			const row = createElement("div", "task-row");
			const taskBox = createElement("div", "task-box", "");
			if (task.uid) {
				taskBox.setAttribute("data-uid", task.uid);
			}
			row.style.width = `${String(getElementFullWidth(this._container))}px`;
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
			this._container.appendChild(row);
			taskBox.addEventListener("click", () => new Task().edit(task));
		});
	}
}
