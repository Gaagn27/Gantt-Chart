import { SubTask } from "../../interfaces/SubTask";
import { Task } from "../../interfaces/Task";
import { Errors } from "../../interfaces/validtions/Errors";
import { InputTypes } from "../../types/Inputs/InputTypes";

export class Validations {
	private readonly _errors: Errors[] = [];
	private readonly task: Task | SubTask;
	constructor(task: Task | SubTask, inputs: InputTypes[]) {
		this.task = task;
		this._init(inputs);
	}

	public required(key: string): void {
		const value = this.task[key];
		if (!value) {
			this._addError(key, `the ${key} field is required`);
		}
	}

	public min(key: string, length: number): void {
		const value = this.task[key];
		if (!value || value.length <= length) {
			this._addError(key, `the ${key} field must be at least ${length}`);
		}
	}

	public errors(): Errors[] {
		return this._errors;
	}

	private _init(inputs: InputTypes[]) {
		Object.entries(inputs).forEach(([, inputType]) => {
			if (inputType.validations) {
				Object.entries(inputType.validations).forEach(([, value]) => {
					const methods: string[] = String(value).split(":");
					const args: string[] = methods[1] ? String(methods[1]).split(",") : [];
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment
					// @ts-ignore
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (typeof this[methods[0]] === "function") {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment
						// @ts-ignore
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						this[methods[0]](inputType.name, ...args);
					}
				});
			}
		});
	}

	private _addError(key: string, message: string) {
		const errorIndex: number = this._errors.findIndex((err: Errors) => err.field === key);
		if (errorIndex < 0) {
			const error: Errors = {
				field: key,
				messages: [message],
			};
			this._errors.push(error);
		} else if (errorIndex >= 0) {
			this._errors[errorIndex].messages.push(message);
		}
	}
}
