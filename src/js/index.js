import "./../styles/main.scss";
import Inputmask from "inputmask";
import { feedbackFormProcess } from "./modules/feedback-form";
import { phoneMaskSetup } from "./modules/masks";
import Modal from "./modules/modal";
(() => {
	const modal = new Modal(
		"overlay",
		"modal",
		"open-modal-btn",
		"close-modal-btn"
	);
	modal.init();

	const feedbackForm = document.getElementById("feedback-form");
	const phoneInput = feedbackForm.querySelector("#feedback-phone");
	const phone = new Inputmask(phoneMaskSetup);
	phone.mask(phoneInput);

	const handleForm = (e) => {
		e.stopPropagation();
		e.preventDefault();
		feedbackFormProcess(e.target);
	};

	feedbackForm.addEventListener("submit", handleForm);
})();
