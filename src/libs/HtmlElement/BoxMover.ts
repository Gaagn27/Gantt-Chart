import { Task } from "../../inerfaces/Task";
import { getDateRange } from "../Date/Date";

export class BoxMover {
	private _tasks: Task[];
	private isMouseDown: boolean;
	private isMouseMove: boolean;
	private boxWidth: number;
	private box: HTMLElement | null;
	private boxClientX: number;
	private readonly mainBox: HTMLElement;
	constructor(tasks: Task[]) {
		this._tasks = tasks;
		this.isMouseDown = false;
		this.isMouseMove = false;
		this.boxWidth = 0;
		this.box = null;
		this.boxClientX = 0;
		this.mainBox = document.getElementById("mainBox") as HTMLElement;
	}

	public boxMoveEvent(): void {
		document.addEventListener("mousedown", (e: MouseEvent) => this.mouseDown(e));

		document.addEventListener("mouseup", (event: MouseEvent) => this.mouseUp(event));
	}

	private modifiedWidth(e: MouseEvent, initialClientX: number, initialWidth: number): number {
		if (this.isMouseDown && initialWidth && this.box) {
			const xCoordinate = e.clientX;
			const calculatedWidth = initialWidth + (xCoordinate - initialClientX);
			this.box.style.width = `${calculatedWidth}px`;
			this.isMouseMove = true;

			return calculatedWidth;
		}

		return 0;
	}

	private mouseDown(event: MouseEvent) {
		const clickedEl = event.target as HTMLElement;
		if (clickedEl.classList.contains("end-date-mod")) {
			this.isMouseDown = true;
			this.box = clickedEl.parentNode as HTMLElement;

			this.boxWidth = this.box.offsetWidth;
			this.boxClientX = event.clientX;

			this.mainBox.addEventListener("mousemove", (e: MouseEvent) =>
				this.modifiedWidth(e, this.boxClientX, this.boxWidth)
			);
		}
	}

	private mouseUp(event: MouseEvent): void {
		this.isMouseDown = false;

		const clickedEl = event.target as HTMLElement;
		if (clickedEl.classList.contains("end-date-mod")) {
			this.adjustBox(clickedEl);
		}
		if (this.box) {
			this.mainBox.removeEventListener("mousemove", (e) => {
				this.modifiedWidth(e, this.boxClientX, this.boxWidth);
			});
			if (!this.isMouseMove) {
				// This condition triggers when there was no mouse move, indicating a click
				event.stopPropagation();
			}
		}
		this.isMouseMove = false;
	}

	private adjustBox(clickedEl: HTMLElement): void {
		const dayEl = document.querySelector("#dateHeader .day") as HTMLElement;

		const dayWidth = dayEl.offsetWidth;
		const { start } = getDateRange(this._tasks);

		const currentStart = new Date(start);
		const otherBox = clickedEl.parentNode as HTMLElement;
		otherBox.removeEventListener("click", (e) => e.preventDefault());
		const otherBoxWidth = otherBox.offsetWidth;
		const otherBoxLeft = otherBox.offsetLeft;
		let newWidth: number;
		const offsetWidth = otherBoxWidth % dayWidth;
		if (offsetWidth < 25) {
			newWidth = otherBoxWidth - (otherBoxWidth % dayWidth);
		} else {
			newWidth = otherBoxWidth - offsetWidth + 50;
		}

		otherBox.style.width = `${newWidth}px`;
		currentStart.setDate(
			currentStart.getDate() + (Math.round((otherBoxWidth + otherBoxLeft) / dayWidth) - 1)
		);
		this._tasks = this._tasks.map((task) => {
			if (task.uid === otherBox.dataset.uid) {
				task.end = currentStart.toISOString().split("T")[0];
			}

			return task;
		});
	}
}
