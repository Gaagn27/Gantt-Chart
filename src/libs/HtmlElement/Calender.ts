import { Task as TaskInterface } from "../../inerfaces/Task";
import { getDateRange, nextDay } from "../Date/Date";
import { Task } from "../Task";
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
		this._tasks.forEach((task) => {
			const row: HTMLElement = createElement("div", "task-row");
			const boxModifier = createElement("div", "box-modifier");
			const taskBox = this._createTaskBox(task);
			row.style.width = `${String(getElementFullWidth(this._container))}px`;
			taskBox.appendChild(this._createTooltip(task));
			taskBox.appendChild(boxModifier);

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
			taskBox.addEventListener("click", () => new Task().edit(task));
		});
		this._boxMoveEvent();
	}

	private _boxMoveEvent() {
		const mainBox = document.getElementById("mainBox") as HTMLElement;
		let isMouseDown = false;
		let boxWidth = 0;
		let box: HTMLElement | null = null;
		let boxClientX = 0;
		let isMouseMove = false;
		const dayEl = document.querySelector("#dateHeader .day") as HTMLElement;
		const dayWidth = dayEl.offsetWidth;
		const modifiedWidth = (
			e: MouseEvent,
			boxElement: HTMLElement | null,
			initialClientX: number,
			initialWidth: number
		) => {
			if (isMouseDown && initialWidth && boxElement) {
				const xCoordinate = e.clientX;
				const calculatedWidth = initialWidth + (xCoordinate - initialClientX);
				boxElement.style.width = `${calculatedWidth}px`;
				isMouseMove = true;

				return calculatedWidth;
			}

			return 0;
		};

		document.addEventListener("mousedown", function (event) {
			const clickedEl = event.target as HTMLElement;
			if (clickedEl.classList.contains("box-modifier")) {
				isMouseDown = true;
				box = clickedEl.parentNode as HTMLElement;

				boxWidth = box.offsetWidth;
				boxClientX = event.clientX;

				mainBox.addEventListener("mousemove", (e) => modifiedWidth(e, box, boxClientX, boxWidth));
			}
		});

		const { start } = getDateRange(this._tasks);
		document.addEventListener("mouseup", (event) => {
			isMouseDown = false;
			const currentStart = new Date(start);
			const clickedEl = event.target as HTMLElement;
			if (clickedEl.classList.contains("box-modifier")) {
				const otherBox = clickedEl.parentNode as HTMLElement;
				const otherBoxWidth = otherBox.offsetWidth;
				const otherBoxLeft = otherBox.offsetLeft;
				currentStart.setDate(
					currentStart.getDate() + Math.round((otherBoxWidth + otherBoxLeft) / dayWidth)
				);
				this._tasks = this._tasks.map((task) => {
					if (task.uid === otherBox.dataset.uid) {
						task.end = currentStart.toISOString().split("T")[0];
					}

					return task;
				});
			}
			if (box) {
				mainBox.removeEventListener("mousemove", (e) => {
					modifiedWidth(e, box, boxClientX, boxWidth);
				});
				if (!isMouseMove) {
					// This condition triggers when there was no mouse move, indicating a click
					event.stopPropagation();

					// Additional click-related logic here
				}
			}
			isMouseMove = false;
		});
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
			taskBox.setAttribute("data-uid", task.uid);
		}
		taskBox.style.position = "absolute";

		return taskBox;
	}
}
