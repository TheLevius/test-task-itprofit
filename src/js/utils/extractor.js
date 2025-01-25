export const extractor = {
	text: (node) => node.value.trim(),
	phone: (node) => node.inputmask.unmaskedvalue(),
	checkbox: (node) => node.checked,
};
