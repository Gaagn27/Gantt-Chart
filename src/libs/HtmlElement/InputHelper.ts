import { BaseInput } from "../../interfaces/html/inputs/BaseInput";
import { createElement } from "./HtmlHelper";

class InputHelper {
	private readonly input: BaseInput;
	private inputEl: HTMLElement | undefined;
	constructor(input: BaseInput) {
		this.input = input;
		this.inputEl = undefined;
	}

	public createInputElement(): HTMLElement {
		switch (this.input.type) {
			case "textarea":
				this.inputEl = document.createElement("textarea");
				if (this.input.value) {
					this.inputEl.innerText = <string>this.input.value;
				}
				break;
			case "select":
				this.inputEl = document.createElement("select");
				// if (this.input.value) {
				// 	this.inputEl.innerText = <string>this.input.value;
				// }
				break;
			default:
				this.inputEl = document.createElement("input");
				if (this.input.value) {
					this.inputEl.setAttribute("value", <string>this.input.value);
				}
				if (this.input.type) {
					this.inputEl.setAttribute("type", this.input.type);
				}
				break;
		}
		this.assignAttribute();
		this.assignClass();

		return this.inputEl;
	}

	private assignAttribute(): this {
		const includedAttributes: string[] = ["class", "label", "type", "value"];
		Object.keys(this.input).forEach((key) => {
			if (!includedAttributes.includes(key) && this.inputEl) {
				this.inputEl.setAttribute(key, <string>this.input[key]);
			}
		});

		return this;
	}

	private assignClass(): this {
		if (this.input.class) {
			let classes: unknown;

			if (typeof this.input.class === "string") {
				classes = this.input.class.split(" ");
			} else {
				classes = this.input.class;
			}

			if (Array.isArray(classes)) {
				classes.forEach((className) => {
					if (this.inputEl) {
						this.inputEl.classList.add(<string>className);
					}
				});
			}
		}

		return this;
	}
}

export function createInputElement(input: BaseInput): HTMLElement {
	const inputHelper = new InputHelper(input);
	const wrap = createElement("div", "row");
	if (input.label) {
		wrap.appendChild(createElement("label", "label", <string>input.label));
	}

	wrap.appendChild(inputHelper.createInputElement());

	return wrap;
}
export function inputValue(name: string): string | null {
	const nameInput = document.querySelector(`input[name='${name}']`) as HTMLInputElement | null;

	return nameInput ? nameInput.value : null;
}
