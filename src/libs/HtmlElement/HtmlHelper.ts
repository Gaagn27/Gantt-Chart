export function createElement(tag: string, className: string, content?: string): HTMLElement {
	const el = document.createElement(tag);
	el.classList.add(className);

	if (content) {
		el.textContent = content;
	}

	return el;
}
