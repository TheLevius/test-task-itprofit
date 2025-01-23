import { sendFeedback } from "./../api/sendFeedback";
import {
	nameValidator,
	emailValidator,
	phoneValidator,
	messageValidator,
} from "./../utils/validators";
import { createRender } from "./../utils/render";

const extractor = {
	text: (node) => node.value.trim(),
	phone: (node) => node.inputmask.unmaskedvalue(),
	checkbox: (node) => node.checked,
};

export async function feedbackFormProcess(formNode) {
	const checkers = new Map([
		[
			"feedback-name",
			{ validate: nameValidator, name: "name", extract: extractor.text },
		],
		[
			"feedback-email",
			{ validate: emailValidator, name: "email", extract: extractor.text },
		],
		[
			"feedback-phone",
			{ validate: phoneValidator, name: "phone", extract: extractor.phone },
		],
		[
			"feedback-message",
			{
				validate: messageValidator,
				name: "message",
				extract: extractor.text,
			},
		],
	]);
	const statusSetup = {
		nodeSelector: ".form__status",
		error: "form--error",
		ok: "form--ok",
	};

	const render = createRender(statusSetup);
	const { errorCount, validatedValues } = validateForm(
		formNode,
		checkers,
		render
	);
	if (errorCount === 0) {
		console.info("Валидация формы прошла успешно");
		const dataJSON = JSON.stringify(validatedValues);
		const response = await sendFeedback(dataJSON).catch(console.error);
		if (response.ok) {
			formNode.reset();
		}
	} else {
		console.info("Ошибка валидации формы");
	}
}
export function validateForm(formNode, checkers, render) {
	const validatedValues = {};
	let errorCount = 0;
	checkers.forEach((options, id) => {
		const element = formNode.elements[id];
		const value = options.extract(element);
		const result = options.validate(value);
		if (result === "OK") {
			validatedValues[id] = value;
		} else {
			errorCount += 1;
		}
		render(element, result);
	});

	return {
		errorCount,
		validatedValues,
	};
}

// export function selectData(node, checkers) {
// 	const data = {};
// 	checkers.forEach((options, id) => {
// 		data[id] = options.extract(node.elements[id]);
// 	});

// 	return data;
// }
