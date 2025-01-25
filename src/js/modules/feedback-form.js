export class FeedbackForm {
	formNode = null;
	submitBtn = null;
	constructor(
		fieldIds,
		fieldCheck,
		statusSetup,
		sendFeedback,
		validModeId,
		feedbackSubmitBtnId,
		extractor
	) {
		this.fieldIds = fieldIds;
		this.fieldCheck = fieldCheck;
		this.status = statusSetup.status;
		this.resultStatus = statusSetup.resultStatus;
		this.sendFeedback = sendFeedback;
		this.validModeId = validModeId;
		this.feedbackSubmitBtnId = feedbackSubmitBtnId;
		this.extractor = extractor;
		this.statusRender = {
			success: this.successRender,
			error: this.errorRender,
		};
	}

	handleFeedbackSubmit = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (this.feedbackSubmitBtnId.disabled) {
			return;
		}
		this.formNode = e.target;
		this.submitBtn = this.formNode.querySelector(
			`#${this.feedbackSubmitBtnId}`
		);
		let fieldValues = this.selectData(this.formNode, this.fieldIds);

		if (!this.isServerValidation()) {
			const { errorCount, idResults } = this.validation(fieldValues);

			if (errorCount > 0) {
				this.errorRender({
					status: "error",
					msg: "Ошибка клиентской валидации",
					fields: idResults,
				});
				return;
			}
		}
		const responseData = await this.getResponseData(fieldValues);
		this.statusRender[responseData.status](responseData);
	};

	validation = (fields) =>
		Object.entries(fields).reduce(
			(out, { 0: id, 1: value }) => {
				out.idResults[id] = this.fieldCheck.get(id).validate(value);
				if (out.idResults[id] !== "OK") {
					out.errorCount += 1;
				}
				return out;
			},
			{ errorCount: 0, idResults: {} }
		);

	successRender = (data) => {
		this.formNode.reset();
		this.fieldCheck.forEach((_, id) => {
			this.render(
				this.selectRenderNode(`#${id}`, this.status),
				"OK",
				this.status
			);
		});
		this.resultRender(data, this.resultStatus);
		console.info("✅ Сообщение оправлено успешно");
	};
	errorRender = (data) => {
		this.fieldCheck.forEach((_, id) => {
			if (Object.hasOwn(data.fields, id)) {
				this.render(
					this.selectRenderNode(`#${id}`, this.status),
					data.fields[id],
					this.status
				);
			} else {
				this.render(
					this.selectRenderNode(`#${id}`, this.status),
					"OK",
					this.status
				);
			}
		});
		this.resultRender(data, this.resultStatus);
		const logMsg =
			Array.from(Object.keys(data.fields)).length > 0
				? "🚫 Серверная ошибка валидации формы"
				: "🚫 Ошибка не связанная с валидацией";
		console.info(logMsg);
	};
	getResponseData = async (frontData) => {
		let response = null;
		if (!this.feedbackSubmitBtnId.disabled) {
			try {
				this.submitBtn.disabled = true;
				response = await this.sendFeedback(frontData);
			} catch (err) {
				console.error(err);
			} finally {
				this.submitBtn.disabled = false;
			}
		} else {
			return;
		}

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			console.error(response.status, response.statusText);
			return {
				status: "error",
				msg: "fetch не смог",
				fields: {},
			};
		}
	};

	isServerValidation = () => {
		const elements = this.formNode.elements;
		return this.extractor.checkbox(elements[this.validModeId]);
	};
	selectData = (node, ids) =>
		ids.reduce((data, id) => {
			data[id] = this.fieldCheck.get(id).extract(node.elements[id]);
			return data;
		}, {});

	selectRenderNode = (inputNodeSelector, status) => {
		const inputNode = this.formNode.querySelector(inputNodeSelector);
		const renderNode = inputNode.parentNode.querySelector(status.nodeSelector);
		return renderNode;
	};
	render = (node, content, status) => {
		const containsStatus = node.classList.contains(status.error);

		if (content !== "OK" && !containsStatus) {
			node.textContent = content;
			node.classList.add(status.error);
		} else if (content !== "OK" && containsStatus) {
			node.textContent = content;
		} else if (content === "OK" && containsStatus) {
			node.textContent = "";
			node.classList.remove(status.error);
		}
	};
	resultRender = (data, status) => {
		const renderNode = this.formNode.querySelector(status.nodeSelector);
		if (data.status === "error") {
			renderNode.classList.remove(status.ok);
			renderNode.classList.add(status.error);
		} else {
			renderNode.classList.remove(status.error);
			renderNode.classList.add(status.ok);
		}
		renderNode.textContent = data.msg;
	};
}
