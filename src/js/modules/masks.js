import Inputmask from "inputmask";
export const phoneMaskSetup = {
	mask: ["+375 (99) 999-99-99"],
	placeholder: "_",
	showMaskOnHover: true,
	insertMode: false,
	onUnMask: (_, unmaskedValue) => {
		return `+375${unmaskedValue}`;
	},
};

export function addPhoneMask(feedbackForm, fieldId) {
	const phoneInput = feedbackForm.querySelector(`#${fieldId}`);
	const phone = new Inputmask(phoneMaskSetup);
	phone.mask(phoneInput);
}
