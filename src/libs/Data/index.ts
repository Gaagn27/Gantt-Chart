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
}
