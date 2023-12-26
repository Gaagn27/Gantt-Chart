import { SubTask } from "../../interfaces/task/SubTask";
import { Task } from "../../interfaces/task/Task";
import { Data } from "../Data";
import { DateHelper, getDateRange } from "../Date/Date";

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
			if (this.box.dataset.uid) {
				const xCoordinate = e.clientX;
				const calculatedLeft = initialLeft - (initialClientX - xCoordinate);
				const calculatedWidth = initialWidth + (initialClientX - xCoordinate);
				this.box.style.left = `${calculatedLeft}px`;
				this.box.style.width = `${calculatedWidth}px`;
				this.isMouseMove = true;

				return calculatedLeft;
			}
		}

		return 0;
	}

	private mouseDown(event: MouseEvent) {
		this.clickedEl = event.target as HTMLElement;
		const dayWidth = this.dayWidth();

		if (this.clickedEl.classList.contains("end-date-mod")) {
			this.isMouseDown = true;
			this.box = this.clickedEl.parentNode as HTMLElement;

			this.boxWidth = this.box.offsetWidth;
			this.boxClientX = event.clientX;
			this.mainBox.addEventListener("mousemove", (e: MouseEvent) => {
				if (this.box && this.box.dataset.uid) {
					const fixPosition = this.box.getBoundingClientRect().left;
					if (fixPosition + dayWidth < e.clientX) {
						this.modifiedWidth(e, this.boxClientX, this.boxWidth);
					}
				}
			});
		}
		if (this.clickedEl.classList.contains("start-date-mod")) {
			this.isMouseDown = true;
			this.box = this.clickedEl.parentNode as HTMLElement;
			const boxLeft = this.box.offsetLeft;
			this.boxLeft = boxLeft;
			const boxWidth = this.box.offsetWidth;
			this.boxClientX = event.clientX;
			this.startMove = true;
			this.mainBox.addEventListener("mousemove", (e: MouseEvent) => {
				if (this.box && this.box.dataset.uid) {
					const fixPosition = this.box.getBoundingClientRect().right;
					if (!(fixPosition - dayWidth > e.clientX)) {
						return;
					}
					const currentTask = new Data().findObj<Task[] | SubTask[], Task | SubTask>(
						this._tasks,
						"uid",
						this.box.dataset.uid
					);
					if (currentTask && currentTask.predecessors) {
						const siblings: (Task | SubTask)[] = this.siblingTasks(currentTask);
						const predecessorsKeys = <string[]>currentTask.predecessors;
						const predecessors = siblings.filter((task) =>
							predecessorsKeys.includes(<string>task.uid)
						);
						const latestDate = new DateHelper(predecessors.map((task) => task.end)).latestDate();
						if (latestDate) {
							const latestDateEl = document.getElementById(String(latestDate.getTime()));
							if (latestDateEl) {
								const clientX = latestDateEl.getBoundingClientRect().right;
								if (clientX < e.clientX) {
									this.modifiedWidthLeft(e, this.boxClientX, boxWidth, boxLeft);
								}
							}
						}
					} else {
						this.modifiedWidthLeft(e, this.boxClientX, boxWidth, boxLeft);
					}
				}
			});
		}
	}

	private siblingTasks(currentTask: Task | SubTask): (Task | SubTask)[] {
		const parentKey: string | undefined = <string>currentTask.parentTask;

		return new Data().findSiblings<Task | SubTask>(this._tasks, "subTasks", "uid", parentKey);
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

	// @ts-ignore
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
		function addDays(date: Date, days: number): Date {
			const result = new Date(date);
			result.setDate(result.getDate() + days);

			return result;
		}
		this._tasks = this._tasks.map((task) => {
			if (task.subTasks) {
				task.subTasks = task.subTasks.map((task) => {
					// const
					if (task.uid === otherBox.dataset.uid) {
						task.end = currentStart.toISOString().split("T")[0];
					}
					if (this.box && this.box.dataset.uid) {
						const currentTask = new Data().findObj<Task[] | SubTask[], Task | SubTask>(
							this._tasks,
							"uid",
							this.box.dataset.uid
						);
						if (currentTask && currentTask.successors) {
							const successors = currentTask.successors as string[];
							if (successors.includes(<string>task.uid)) {
								const startDate = new Date(task.start);

								const difference = currentStart.getTime() - startDate.getTime();

								const differenceInDays = Math.round(difference / (1000 * 60 * 60 * 24));

								if (differenceInDays > 0) {
									task.start = addDays(startDate, differenceInDays).toISOString().split("T")[0];
									task.end = addDays(new Date(task.end), differenceInDays)
										.toISOString()
										.split("T")[0];
									const taskBox = document.querySelector(
										`[class="task-box"][data-uid="${<string>task.uid}"]`
									) as HTMLElement | undefined;
									if (taskBox) {
										taskBox.style.left = `${otherBox.offsetLeft + otherBox.offsetWidth}px`;
									}
								}
							}
						}
					}

					return task;
				});
			}
			if (task.uid === otherBox.dataset.uid) {
				task.end = currentStart.toISOString().split("T")[0];
			}

			return task;
		});
	}

	private adjustStartDate(clickedEl: HTMLElement): void {
		const dayWidth = this.dayWidth();
		const otherBox = clickedEl.parentNode as HTMLElement;
		const startDate = new Data().findObj<Task[], Task>(
			this._tasks,
			"uid",
			<string>otherBox.dataset.uid
		);
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
