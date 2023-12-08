import { ModalConfigs } from "../../interfaces/html/ModalConfigs";
import { InputTypes } from "../../types/Inputs/InputTypes";
import { createElement } from "./HtmlHelper";
import { createInputElement } from "./InputHelper";

export class Modal {
	public static openModal(): void {
		const modal = document.getElementById("modal");
		const overlay = document.getElementById("overlay");
		if (modal) {
			modal.style.display = "block";
		}
		if (overlay) {
			overlay.style.display = "block";
		}
		const uid = document.querySelector("input[name='_uid']");
		if (uid) {
			const addTask = document.getElementById("addTask") as HTMLElement;
			addTask.innerText = "Update";
		}
	}

	public static closeModal(): void {
		const addTask = document.getElementById("addTask") as HTMLElement;
		addTask.innerText = "Create";
		const modal = document.getElementById("modal");
		const overlay = document.getElementById("overlay");
		const uid = document.querySelector("input[name='_uid']");
		if (uid) {
			uid.remove();
		}
		if (modal) {
			modal.style.display = "none";
		}
		if (overlay) {
			overlay.style.display = "none";
		}
	}

	public static renderModal(configs: ModalConfigs): void {
		const modal: HTMLElement = createElement("div", "modal");
		modal.id = "modal";
		const modalHeader: HTMLElement = createElement("div", "modal-header");
		const modalBody: HTMLElement = createElement("div", "modal-body");
		const taskForm: HTMLElement = createElement("form", "task-form");
		const modalFooter: HTMLElement = createElement("div", "modal-footer");
		const modalHeaderLabel: HTMLElement = createElement("div", "modal-title", "this id modal");
		const closeButton: HTMLElement = createElement("span", "close", "X");
		const save: HTMLElement = createElement("button", "btn", "Create");
		save.id = "addTask";
		closeButton.innerHTML = "&times;";
		modal.appendChild(modalHeader);
		modalHeader.appendChild(modalHeaderLabel);
		modalHeader.appendChild(closeButton);
		modal.appendChild(modalBody);
		modalFooter.appendChild(save);
		modal.appendChild(modalFooter);
		document.body.appendChild(modal);
		const elements = configs.inputs;
		taskForm.id = "taskForm";
		this._createInputs(modalBody.appendChild(taskForm), elements);
		const overlay: HTMLElement = createElement("div", "overlay");
		overlay.id = "overlay";
		document.body.appendChild(overlay);
		overlay.addEventListener("click", () => Modal.closeModal());
		closeButton.addEventListener("click", () => Modal.closeModal());
	}

	private static _createInputs(container: HTMLElement, elements: InputTypes[]): void {
		elements.forEach((element) => {
			container.appendChild(createInputElement(element));
		});
	}
}
