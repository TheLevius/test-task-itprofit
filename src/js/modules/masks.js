export const phoneMaskSetup = {
	mask: ["+375 (99) 999-99-99"],
	placeholder: "_",
	showMaskOnHover: true,
	onUnMask: (_, unmaskedValue) => `+375${unmaskedValue}`,
};
