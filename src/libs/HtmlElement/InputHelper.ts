import { Input } from "../../inerfaces/html/Input";
import { createElement } from "./HtmlHelper";

export function createInputElement(input: Input): HTMLElement {
	let htmlElement: HTMLElement;
	const wrap = createElement("div", "row");
	if (input.label) {
		wrap.appendChild(createElement("label", "label", <string>input.label));
	}
	if (input.type !== "textarea") {
		htmlElement = document.createElement("input");
		if (input.value) {
			htmlElement.setAttribute("value", <string>input.value);
		}
		if (input.type) {
			htmlElement.setAttribute("type", input.type);
		}
	} else {
		htmlElement = document.createElement("textarea");
		if (input.value) {
			htmlElement.innerText = <string>input.value;
		}
	}
	const includedAttributes: string[] = ["class", "label", "type", "value"];
	Object.keys(input).forEach((key) => {
		if (!includedAttributes.includes(key)) {
			htmlElement.setAttribute(key, <string>input[key]);
		}
	});

	if (input.class) {
		let classes: string | number | boolean | string[];

		if (input.class && typeof input.class === "string") {
			classes = input.class.split(" ");
		} else {
			classes = input.class || [];
		}

		if (Array.isArray(classes)) {
			classes.forEach((className) => {
				htmlElement.classList.add(className);
			});
		}
		// htmlElement.setAttribute("class", input.class);
	}
	wrap.appendChild(htmlElement);

	return wrap;
}
