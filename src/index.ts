import "../src/sass/main.scss";

import { Task } from "./interfaces/task/Task";
import { RenderCalender } from "./libs/HtmlElement/RenderCalender";

// Get the current date
const currentDate = new Date();

// Get the start of the current month
const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);

// Get the end of the current month
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

// Format dates in ISO format (YYYY-MM-DD)
const start = startOfMonth.toISOString().slice(0, 10);
const end = endOfMonth.toISOString().slice(0, 10);
const tasks = [
	{
		name: "Parent Task 1",
		start,
		end,
		completion: 10,
		uid: "rsa",
		subTasks: [
			{
				name: "sub task 1",
				start: "2023-12-03",
				end: "2023-12-08",
				parentTask: "rsa",
				completion: 20,
			},
			{
				name: "sub task 3",
				start: "2023-12-04",
				end: "2023-12-08",
				parentTask: "rsa",
				completion: 30,
			},
			{
				name: "sub task 5",
				start: "2023-12-13",
				end: "2023-12-18",
				parentTask: "rsa",
				completion: 10,
			},
		],
	},
	{
		name: "Parent Task 2",
		start: "2023-12-07",
		end: "2024-01-03",
		uid: "ss",
		completion: 0,
	},
];
new RenderCalender({
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
				validations: ["required", "min:3"],
				class: "Project",
			},
			{
				name: "start",
				type: "date",
				label: "Project Start Date",
				class: "Project",
				validations: ["required"],
			},
			{
				name: "end",
				type: "date",
				label: "Project End Date",
				class: "Project",
				validations: ["required"],
			},
			{
				name: "completion",
				type: "number",
				label: "Project Completion",
				minimum: 0,
				maximum: 100,
				class: "Project",
				validations: ["required"],
			},
			{
				name: "parentTask",
				type: "select",
				options: [],
				label: "Tasks",
			},
			{
				name: "successor",
				type: "select",
				options: [],
				multiple: true,
				label: "Successor",
			},
			{
				name: "predecessor",
				type: "select",
				options: [],
				multiple: true,
				label: "Predecessor",
			},
		],
	},
}).renderCalendar();
function addTask(task: Task) {
	console.log(task, "for user");
}
