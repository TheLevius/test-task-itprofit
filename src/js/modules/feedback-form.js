import { sendFeedback } from "./../api/sendFeedback";
import {
	nameValidator,
	emailValidator,
	phoneValidator,
	messageValidator,
} from "./../utils/validators";
import { createRender } from "./../utils/render";

export async function feedbackFormProcess(formNode) {
	const checkers = new Map([
		["feedback-name", { validate: nameValidator, name: "name" }],
		["feedback-email", { validate: emailValidator, name: "email" }],
		["feedback-phone", { validate: phoneValidator, name: "phone" }],
		["feedback-message", { validate: messageValidator, name: "message" }],
	]);
	const statusSetup = {
		nodeSelector: ".form__status",
		error: "form--error",
		ok: "form--ok",
	};

	const render = createRender(statusSetup);
	const { errorCount } = validateForm(formNode, checkers, render);
	if (errorCount === 0) {
		console.info("Валидация формы прошла успешно");
		const selectedData = selectData(formNode, [
			"name",
			"email",
			"phone",
			"message",
		]);
		const dataJSON = JSON.stringify(selectedData);
		const response = await sendFeedback(dataJSON).catch(console.error);
		if (response.ok) {
			formNode.reset();
		}
	} else {
		console.info("Ошибка валидации формы");
	}
}
export function validateForm(formNode, checkers, render) {
	let errorCount = 0;
	checkers.forEach((value, id) => {
		const element = formNode.elements[id];
		const result = value.validate(element);

		if (result !== "OK") {
			errorCount += 1;
		}
		render(element, result);
	});

	return {
		errorCount,
	};
}

export function selectData(node, dataNames) {
	const formData = new FormData(node);
	return dataNames.reduce((data, name) => {
		data[name] = formData.get(name);
		return data;
	}, {});
}
