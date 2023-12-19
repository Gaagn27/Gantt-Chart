import { InputTypes } from "../../../types/Inputs/InputTypes";
import { InputHelper } from "../InputHelper";

export class SelectOptionsHelper {
	private readonly _inputs: InputTypes[];
	constructor(inputs: InputTypes[] = []) {
		this._inputs = inputs;
	}

	public setTasksInputs(
		inputName: string,
		options: { label: string; value: string | undefined }[]
	): void {
		this._inputs.map((input) => {
			if (input.name === inputName) {
				input.options = options;
			}

			return input;
		});
		const taskSelect: InputTypes | undefined = this._inputs.find(
			(input) => input.name === inputName
		);
		if (taskSelect) {
			const select = new InputHelper(taskSelect);
			select.updateSelectOptions();
		}
	}
}
