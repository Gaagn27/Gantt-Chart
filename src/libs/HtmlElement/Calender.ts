import { Task as TaskInterface } from "../../inerfaces/Task";
import { getDateRange, nextDay } from "../Date/Date";
import { Task } from "../Task";
import { BoxMover } from "./BoxMover";
import { GanttChart } from "./GanttChart";
import { createElement, getElementFullWidth } from "./HtmlHelper";

export class Calender extends GanttChart {
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
		// eslint-disable-next-line array-callback-return
		document.querySelectorAll(".mainBox>.task-row").forEach((e) => e.remove());
		this._tasks.forEach((task) => {
			const row: HTMLElement = createElement("div", "task-row");
			const startDateModifier: HTMLElement = createElement("div", "start-date-mod");
			const endDateModifier = createElement("div", "end-date-mod");
			const midBox = createElement("div", "mid-box");
			endDateModifier.classList.add("box-modifier");
			startDateModifier.classList.add("box-modifier");
			const taskBox = this._createTaskBox(task);
			row.style.width = `${String(getElementFullWidth(this._container))}px`;
			taskBox.appendChild(this._createTooltip(task));
			taskBox.appendChild(startDateModifier);
			taskBox.appendChild(endDateModifier);
			taskBox.appendChild(midBox);

			const leftBox = document.getElementById(Date.parse(task.start).toString());
			const leftCords = leftBox?.offsetLeft ?? 0;
			const rightBox = document.getElementById(Date.parse(task.end).toString())?.offsetLeft ?? 0;
			const width: number = rightBox - leftCords + 50;
			taskBox.style.left = `${leftCords}px`;
			taskBox.style.width = `${width}px`;
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			taskBox.style.top = `${document.getElementById(`task-side${task.name}`)?.offsetTop}px`;
			row.appendChild(taskBox);

			this._container.appendChild(row);
			midBox.addEventListener("click", () => new Task().edit(task));
		});
		const boxMover = new BoxMover(this._tasks);
		boxMover.boxMoveEvent();
	}

	public renderCalender(): void {
		this._container.innerHTML = "";
		this.renderDayHeaders();
		this.renderTaskRows();
		this.drawLine();
	}

	public updateTasks(tasks: TaskInterface[]): void {
		const oldDate = getDateRange(this._tasks);
		const newDate = getDateRange(tasks);
		if (oldDate.start > newDate.start || oldDate.end < newDate.end) {
			this.renderCalender();

			return;
		}
		super.updateTasks(tasks);
	}

	private _createTooltip(task: TaskInterface): HTMLElement {
		const tooltip = createElement("div", "task-box-text");
		tooltip.innerHTML = `<h6>${task.name}</h2>
							<span><strong>Start</strong> ${task.start}</span>
							<span><strong>End</strong> ${task.end}</span>`;

		return tooltip;
	}

	private _createTaskBox(task: TaskInterface): HTMLElement {
		const taskBox = createElement("div", "task-box", "");
		if (task.uid) {
			taskBox.setAttribute("data-uid", <string>task.uid);
		}
		taskBox.style.position = "absolute";

		return taskBox;
	}
}
