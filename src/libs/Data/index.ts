import { Task } from "../../interfaces/task/Task";

export class Data{
	public findObj<T>(obj: T, dataKey: string, dataValue: string | number | boolean): Task | false {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const value = obj[key];
				if (key === dataKey && value === dataValue) {
					return obj as Task;
				}
				if (typeof value === "object" && value !== null) {
					const found = this.findObj(value, dataKey, dataValue);
					if (found) {
						return found;
					}
				}
			}
		}

		return false;
	}
}
