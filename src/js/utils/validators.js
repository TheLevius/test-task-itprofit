export function nameValidator(node) {
	const value = node.value.trim();
	if (!value) {
		return "Обязательно для заполнения";
	}
	if (/^\s|\s$/.test(value)) {
		return "Нельзя начинать или заканчивать пробелами";
	}
	if (value.length < 2) {
		return "Слишком короткое";
	}
	if (value.length > 50) {
		return "Слишком длинное";
	}
	if (/\d/.test(value)) {
		return "Имя не должно содержать цифры";
	}
	if (!/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/.test(value)) {
		return "Недопустимые символы";
	}
	if (value.split(" ").length > 1) {
		return "Введите только одно имя";
	}
	return "OK";
}
export function emailValidator(node) {
	const value = node.value.trim();
	const maxLocalName = 64;
	const maxDomainName = 255;
	const invalidFormat = "Формат некорректный.";
	if (!value) {
		return "Email не может быть пустым.";
	}
	if (!value.includes("@") || !value.includes(".")) {
		return invalidFormat;
	}
	const { 0: localPart, 1: domain } = value.split("@");
	if (localPart.length > maxLocalName) {
		return "Слишком длинное локальное имя";
	}
	if (domain.length > maxDomainName) {
		return "Слишком длинное доменное имя";
	}
	if (/^\./.test(domain) || /\.$/.test(domain) || /\.{2,}/.test(domain)) {
		return invalidFormat;
	}
	const emailRegex =
		/^(?:"[^\"]+"|[a-zA-Z0-9._%+-]+)@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(value)) {
		return invalidFormat;
	}
	return "OK";
}
export function phoneValidator(node) {
	if (!node.inputmask.isComplete()) {
		return "Неполный номер";
	}

	return node.inputmask.isValid() && "OK";
}
export function messageValidator(node) {
	const value = node.value.trim();
	const minLen = 10;
	const maxLen = 500;
	if (!value) {
		return "Поле не может быть пустым.";
	}
	if (value.length < minLen) {
		return `Сообщение не может быть короче ${minLen} символов.`;
	}
	if (value.length > maxLen) {
		return `Сообщение не может быть длиннее ${maxLen} символов.`;
	}

	const forbiddenCharsRegex = /[<>]/;
	if (forbiddenCharsRegex.test(value)) {
		return "Текст содержит недопустимые символы.";
	}
	return "OK";
}
export function agreeValidator(node) {
	const value = node.checked;
	return value ? "OK" : "Согласие обязательно";
}
