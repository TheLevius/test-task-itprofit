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
	const serverValidation = true;
	if (serverValidation) {
		sendFeedbackAndRender(selectData(formNode, checkers), formNode, render);
	} else {
		const { errorCount, validatedValues } = validateForm(
			formNode,
			checkers,
			render
		);
		if (errorCount === 0) {
			console.info("Валидация формы прошла успешно");
			sendFeedbackAndRender(validatedValues, formNode, render);
		} else {
			console.info("Ошибка валидации формы");
		}
	}
}

export function validateForm(formNode, checkers, render) {
	const validatedValues = {};
	const errors = {};
	let errorCount = 0;
	checkers.forEach((options, id) => {
		const element = formNode.elements[id];
		const value = options.extract(element);
		const result = options.validate(value);
		if (result === "OK") {
			validatedValues[id] = value;
		} else {
			errorCount += 1;
			errors[id] = result;
		}
		render(element, result);
	});

	return {
		errorCount,
		validatedValues,
		errors,
	};
}

export function selectData(node, checkers) {
	const data = {};
	checkers.forEach((options, id) => {
		data[id] = options.extract(node.elements[id]);
	});

	return data;
}

export const responseStatusRender = {
	success: (data, formNode, render) => {
		formNode.reset();
		const resultStatusNode = formNode.querySelector("#result-status");
		resultStatusNode.textContent = data?.msg;
		console.log(resultStatusNode);
		console.info("Серверная валидация формы прошла успешно");
	},
	error: (data, formNode, render) => {
		const fieldIds = Object.keys(data.fields);
		for (const id of fieldIds) {
			render(formNode.elements[id], data[id]);
		}
		const resultStatusNode = formNode.querySelector("#result-status");
		resultStatusNode.textContent = data?.msg;
		console.info("Серверная ошибка валидации формы");
	},
};
async function sendFeedbackAndRender(fields, formNode, render) {
	const response = await sendFeedback(fields).catch(console.error);
	if (response.ok) {
		const data = await response.json();
		responseStatusRender[data.status](data, formNode, render);
	}
}
