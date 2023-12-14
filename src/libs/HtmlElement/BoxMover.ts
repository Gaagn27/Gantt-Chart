import { Task } from "../../interfaces/task/Task";
import { getDateRange } from "../Date/Date";

export class BoxMover {
	private _tasks: Task[];
	private isMouseDown: boolean;
	private isMouseMove: boolean;
	private boxWidth: number;
	private box: HTMLElement | null;
	private boxClientX: number;
	private readonly mainBox: HTMLElement;
	private boxLeft: number;
	private clickedEl: HTMLElement | undefined;
	private startMove: boolean;
	constructor(tasks: Task[]) {
		this._tasks = tasks;
		this.isMouseDown = false;
		this.isMouseMove = false;
		this.startMove = false;
		this.boxWidth = 0;
		this.box = null;
		this.boxClientX = 0;
		this.boxLeft = 0;
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

	private modifiedWidthLeft(
		e: MouseEvent,
		initialClientX: number,
		initialWidth: number,
		initialLeft: number
	): number {
		if (this.isMouseDown && initialLeft && this.box && this.startMove) {
			const xCoordinate = e.clientX;
			const calculatedLeft = initialLeft - (initialClientX - xCoordinate);
			const calculatedWidth = initialWidth + (initialClientX - xCoordinate);
			this.box.style.left = `${calculatedLeft}px`;
			this.box.style.width = `${calculatedWidth}px`;
			this.isMouseMove = true;

			return calculatedLeft;
		}

		return 0;
	}

	private mouseDown(event: MouseEvent) {
		this.clickedEl = event.target as HTMLElement;
		if (this.clickedEl.classList.contains("end-date-mod")) {
			this.isMouseDown = true;
			this.box = this.clickedEl.parentNode as HTMLElement;

			this.boxWidth = this.box.offsetWidth;
			this.boxClientX = event.clientX;

			this.mainBox.addEventListener("mousemove", (e: MouseEvent) =>
				this.modifiedWidth(e, this.boxClientX, this.boxWidth)
			);
		}
		if (this.clickedEl.classList.contains("start-date-mod")) {
			this.isMouseDown = true;
			this.box = this.clickedEl.parentNode as HTMLElement;
			const boxLeft = this.box.offsetLeft;
			this.boxLeft = boxLeft;
			const boxWidth = this.box.offsetWidth;
			this.boxClientX = event.clientX;
			this.startMove = true;
			this.mainBox.addEventListener("mousemove", (e: MouseEvent) =>
				this.modifiedWidthLeft(e, this.boxClientX, boxWidth, boxLeft)
			);
		}
	}

	private mouseUp(event: MouseEvent): void {
		this.isMouseDown = false;
		if (this.clickedEl) {
			if (this.clickedEl.classList.contains("end-date-mod")) {
				this.adjustBox(this.clickedEl);
			}
			if (this.clickedEl.classList.contains("start-date-mod")) {
				this.startMove = false;
				this.adjustStartDate(this.clickedEl);
			}
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
		const dayWidth = this.dayWidth();
		const { start } = getDateRange(this._tasks);

		const currentStart = new Date(start);
		const otherBox = clickedEl.parentNode as HTMLElement;
		otherBox.removeEventListener("click", (e) => e.preventDefault());
		const otherBoxWidth = otherBox.offsetWidth;
		const otherBoxLeft = otherBox.offsetLeft;
		let newWidth: number;
		const offsetWidth = otherBoxWidth % dayWidth;
		if (offsetWidth < dayWidth / 2) {
			newWidth = otherBoxWidth - (otherBoxWidth % dayWidth);
		} else {
			newWidth = otherBoxWidth - offsetWidth + dayWidth;
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

	private adjustStartDate(clickedEl: HTMLElement): void {
		const dayWidth = this.dayWidth();

		const otherBox = clickedEl.parentNode as HTMLElement;
		const startDate = this._tasks.find((task) => task.uid === otherBox.dataset.uid);
		const currentStart = startDate ? new Date(startDate.start) : false;

		if (currentStart) {
			const otherBoxWidth = otherBox.offsetWidth;
			const otherBoxLeft = otherBox.offsetLeft;
			let newWidth: number;
			let newLeft: number;
			const offsetWidth = otherBoxWidth % dayWidth;
			if (offsetWidth < dayWidth / 2) {
				newLeft = otherBoxLeft + (otherBoxWidth % dayWidth);
				newWidth = otherBoxWidth - (otherBoxWidth % dayWidth);
			} else {
				// console.log(otherBoxLeft , ((otherBoxWidth % dayWidth) - dayWidth));
				newLeft = otherBoxLeft - (dayWidth - (otherBoxWidth % dayWidth));
				newWidth = otherBoxWidth - offsetWidth + dayWidth;
			}

			otherBox.style.width = `${newWidth}px`;
			otherBox.style.left = `${newLeft}px`;
			currentStart.setDate(
				currentStart.getDate() + Math.round((newLeft - this.boxLeft) / dayWidth)
			);
			this._tasks = this._tasks.map((task) => {
				if (task.uid === otherBox.dataset.uid) {
					task.start = currentStart.toISOString().split("T")[0];
				}

				return task;
			});
		}
	}

	private dayWidth(): number {
		const dayEl = document.querySelector("#dateHeader .day") as HTMLElement;

		return dayEl.offsetWidth;
	}
}
