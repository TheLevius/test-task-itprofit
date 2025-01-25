import "./../styles/main.scss";
import { FeedbackForm } from "./modules/feedback-form";
import { addPhoneMask } from "./modules/masks";
import Modal from "./modules/modal";
import { sendFeedback } from "./api/sendFeedback";
import {
	nameValidator,
	emailValidator,
	phoneValidator,
	messageValidator,
} from "./utils/validators";
import { extractor } from "./utils/extractor";
(() => {
	const modal = new Modal(
		"overlay",
		"modal",
		"open-modal-btn",
		"close-modal-btn"
	);
	modal.init();

	const formNode = document.getElementById("feedback-form");
	addPhoneMask(formNode, "feedback-phone");

	const dataFieldOptions = new Map([
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

	const status = {
		nodeSelector: ".form__status",
		error: "form--error",
		ok: "form--ok",
	};

	const resultStatus = {
		nodeSelector: "#result-status",
		error: "form__status-result--error",
		ok: "form__status-result--ok",
	};

	const validModeId = "feedback-validation";
	const feedbackSubmitBtnId = "feedback-submit";
	const dataFieldIds = Array.from(dataFieldOptions.keys());

	const feedbackForm = new FeedbackForm(
		dataFieldIds,
		dataFieldOptions,
		{ status, resultStatus },
		sendFeedback,
		validModeId,
		feedbackSubmitBtnId,
		extractor
	);

	formNode.addEventListener("submit", feedbackForm.handleFeedbackSubmit);
})();
