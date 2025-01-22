export const createRender = (status) => (element, content) => {
	const renderNode = element.parentNode.querySelector(status.nodeSelector);
	const containsStatus = renderNode.classList.contains(status.error);

	if (content !== "OK" && !containsStatus) {
		renderNode.textContent = content;
		renderNode.classList.add(status.error);
	} else if (content !== "OK" && containsStatus) {
		renderNode.textContent = content;
	} else if (content === "OK" && containsStatus) {
		renderNode.textContent = "";
		renderNode.classList.remove(status.error);
	}
	return content;
};
