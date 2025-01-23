export const sendFeedback = async (data) =>
	fetch(`/api/feedback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
