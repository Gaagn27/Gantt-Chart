import { Task } from "../../inerfaces/Task";

export function getEarliestDate(tasks: Task[]): Date {
	const latestEndDate = new Date(Math.min(...tasks.map((t) => new Date(t.start).getTime())));

	return new Date(latestEndDate);
}

export function getLatestDate(tasks: Task[]): Date {
	const latestEndDate = new Date(Math.max(...tasks.map((t) => new Date(t.end).getTime())));

	return new Date(latestEndDate);
}
