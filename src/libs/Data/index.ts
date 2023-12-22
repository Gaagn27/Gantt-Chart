import { ObjectWithChildren } from "../../interfaces/object/ObjectWithChildren";

export class Data {
	public findObj<T, K>(obj: T, dataKey: string, dataValue: string | number | boolean): K | false {
		for (const key in obj) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				continue;
			}
			const value = obj[key];
			if (key === dataKey && value === dataValue) {
				return obj as unknown as K;
			}
			if (typeof value === "object" && value !== null) {
				const found = this.findObj(value, dataKey, dataValue);
				if (found) {
					return found as K;
				}
			}
		}

		return false;
	}

	public findSiblings<T extends ObjectWithChildren>(
		objs: T[],
		childKey: string,
		key: string,
		value: string | false = false
	): T[] {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const parent = objs.find((obj) => obj[key] === value);

		if (parent && childKey in parent) {
			return parent[childKey] as T[];
		}

		return objs;
	}
}
